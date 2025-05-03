import React, { useState, useEffect, useContext } from 'react';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

// Configuration for API calls
const API_BASE_URL = 'http://127.0.0.1:8000'; // Change this for production

function TacticalAnalysisPage() {
  const { User, videoId } = useContext(UserContext);
  const [localVideoId, setLocalVideoId] = useState(videoId);
  const [matchStats, setMatchStats] = useState(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'fetching', 'completed', 'failed'
  const [apiError, setApiError] = useState(null);

  // Fetch or validate video ID
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setStatus('fetching');
        const token = localStorage.getItem('token');
        let selectedVideoId = videoId;

        if (videoId) {
          const response = await axios.get(`${API_BASE_URL}/api/videos/${videoId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('UserContext video data response:', response.data);
          if (response.data.status !== 'completed') {
            console.warn(`Video ID ${videoId} is not completed (status: ${response.data.status}). Fetching latest completed video.`);
            selectedVideoId = null;
          }
        }

        if (!selectedVideoId) {
          const videosResponse = await axios.get(`${API_BASE_URL}/api/videos/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Videos list response:', videosResponse.data);
          const completedVideo = videosResponse.data.find(video => video.status === 'completed');
          if (completedVideo) {
            selectedVideoId = completedVideo.id;
            console.log(`Selected latest completed video ID: ${selectedVideoId}`);
          } else {
            throw new Error('No completed videos found.');
          }
        }

        setLocalVideoId(selectedVideoId);
        const response = await axios.get(`${API_BASE_URL}/api/videos/${selectedVideoId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Selected video data response:', response.data);
        setStatus(response.data.status);
        checkStatus(selectedVideoId);
      } catch (error) {
        console.error('Failed to fetch video data:', error);
        setStatus('failed');
        setApiError(error.message || 'Failed to fetch video data. Please process a video first.');
      }
    };

    fetchVideoData();
  }, [videoId]); 

  useEffect(() => {
    let interval;
    if (localVideoId && (status === 'processing' || status === 'uploading')) {
      interval = setInterval(() => checkStatus(localVideoId), 5000);
    }
    return () => clearInterval(interval);
  }, [localVideoId, status]);

  useEffect(() => {
    if (results?.summary && status === 'completed') {
      const fetchMatchSummary = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(results.summary, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Match summary response:', response.data);
          setMatchStats(response.data);
        } catch (error) {
          console.error('Failed to fetch match summary:', error);
          setMatchStats(null);
          setApiError('Failed to fetch match summary.');
        }
      };
      fetchMatchSummary();
    }
  }, [results, status]);

  const checkStatus = async (id) => {
    try {
      console.log(`Checking status for video ${id} at ${API_BASE_URL}/api/videos/${id}/`);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/videos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Status response:', response.data);
      setStatus(response.data.status);

      if (response.data.status === 'completed') {
        const ensureAbsoluteUrl = (url) => {
          if (!url) return null;
          return url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        };

        setResults({
          summary: ensureAbsoluteUrl(response.data.summary_json_url),
          objectTracks: ensureAbsoluteUrl(response.data.object_tracks_json_url),
          keypointTracks: ensureAbsoluteUrl(response.data.keypoint_tracks_json_url),
        });
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setStatus('failed');
      setApiError('Status check failed.');
    }
  };

  return (
    <Layout title="Tactical Analysis">
      {apiError && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{apiError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TeamStats matchStats={matchStats} status={status} />
        <DistanceComparison matchStats={matchStats} status={status} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <SpeedAnalysis matchStats={matchStats} status={status} />
        <TopPerformers matchStats={matchStats} status={status} />
      </div>
    </Layout>
  );
}

function TeamStats({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">POSSESSION & PASSING COMPARISON</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching team statistics...' : 'Team statistics data not available'}
        </div>
      </div>
    );
  }

  const teamAPossession = matchStats.team_stats?.['Team A']?.possession_percentage || 50;
  const teamBPossession = matchStats.team_stats?.['Team B']?.possession_percentage || 50;

  // Calculate pass stats
  const calculatePassStats = () => {
    const teamAPasses = matchStats.passes?.filter(pass => pass.from_team === 'Team A').length || 0;
    const teamBPasses = matchStats.passes?.filter(pass => pass.from_team === 'Team B').length || 0;
    const teamASuccessful = matchStats.passes?.filter(
      pass => pass.from_team === 'Team A' && pass.from_team === pass.to_team
    ).length || 0;
    const teamBSuccessful = matchStats.passes?.filter(
      pass => pass.from_team === 'Team B' && pass.from_team === pass.to_team
    ).length || 0;
    return {
      teamAPasses,
      teamBPasses,
      teamASuccessful,
      teamBSuccessful,
      teamAPassSuccessRate: teamAPasses ? (teamASuccessful / teamAPasses * 100).toFixed(0) : 0,
      teamBPassSuccessRate: teamBPasses ? (teamBSuccessful / teamBPasses * 100).toFixed(0) : 0,
    };
  };

  const passStats = calculatePassStats();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">POSSESSION & PASSING COMPARISON</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-80 custom-scrollbar">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-white text-sm">Team A</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-white text-sm">Team B</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">POSSESSION</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart
              layout="vertical"
              data={[{ name: 'Ball Possession', teamA: teamAPossession, teamB: teamBPossession }]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" domain={[0, 100]} stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Bar dataKey="teamA" name="Team A" fill="#3b82f6" stackId="stack" />
              <Bar dataKey="teamB" name="Team B" fill="#ec4899" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">PASSES</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={[
                { name: 'Total Passes', teamA: passStats.teamAPasses, teamB: passStats.teamBPasses },
                { name: 'Completed', teamA: passStats.teamASuccessful, teamB: passStats.teamBSuccessful },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Bar dataKey="teamA" name="Team A" fill="#3b82f6" barSize={40} />
              <Bar dataKey="teamB" name="Team B" fill="#ec4899" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Pass Success Rate</span>
              <span className="text-white">{passStats.teamAPassSuccessRate}% | {passStats.teamBPassSuccessRate}%</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: `${passStats.teamAPassSuccessRate / (parseInt(passStats.teamAPassSuccessRate) + parseInt(passStats.teamBPassSuccessRate) || 1) * 100}%` }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: `${passStats.teamBPassSuccessRate / (parseInt(passStats.teamAPassSuccessRate) + parseInt(passStats.teamBPassSuccessRate) || 1) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistanceComparison({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">DISTANCE COVERED</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching distance data...' : 'Distance data not available'}
        </div>
      </div>
    );
  }

  // Calculate total team distance in metres
  const calculateTeamDistance = () => {
    const teamADistance = Object.values(matchStats.player_stats || {})
      .filter(player => player.team === 'Team A')
      .reduce((sum, player) => sum + (player.total_distance_m || 0), 0);
    const teamBDistance = Object.values(matchStats.player_stats || {})
      .filter(player => player.team === 'Team B')
      .reduce((sum, player) => sum + (player.total_distance_m || 0), 0);
    return { teamADistance, teamBDistance };
  };

  const { teamADistance, teamBDistance } = calculateTeamDistance();

  const distanceTimeline = matchStats.distance_timeline?.length ? matchStats.distance_timeline.map(item => ({
    period: item.period,
    teamA: (item.teamA * 1000) || (teamADistance / 6), // Convert km to m if provided
    teamB: (item.teamB * 1000) || (teamBDistance / 6),
  })) : [
    { period: '0-15', teamA: teamADistance / 6, teamB: teamBDistance / 6 },
    { period: '15-30', teamA: teamADistance / 6, teamB: teamBDistance / 6 },
    { period: '30-45', teamA: teamADistance / 6, teamB: teamBDistance / 6 },
    { period: '45-60', teamA: teamADistance / 6, teamB: teamBDistance / 6 },
    { period: '60-75', teamA: teamADistance / 6, teamB: teamBDistance / 6 },
    { period: '75-90', teamA: teamADistance / 6, teamB: teamBDistance / 6 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">DISTANCE COVERED</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-80 custom-scrollbar">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-white text-sm">Team A</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-white text-sm">Team B</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">TOTAL TEAM DISTANCE (M)</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart
              layout="vertical"
              data={[{ name: 'Distance (m)', teamA: teamADistance, teamB: teamBDistance }]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Bar dataKey="teamA" name="Team A" fill="#3b82f6" />
              <Bar dataKey="teamB" name="Team B" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">DISTANCE BY PERIOD (M)</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart
              data={distanceTimeline}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="period" stroke="#666" />
              <YAxis stroke="#666" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Line type="monotone" dataKey="teamA" name="Team A" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="teamB" name="Team B" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SpeedAnalysis({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">SPEED ANALYSIS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching speed data...' : 'Speed data not available'}
        </div>
      </div>
    );
  }

  // Calculate average team speed (total distance / time in hours)
  const calculateAverageTeamSpeed = () => {
    const matchDurationHours = 90 / 60; // 90 minutes
    const teamADistance = Object.values(matchStats.player_stats || {})
      .filter(player => player.team === 'Team A')
      .reduce((sum, player) => sum + (player.total_distance_m || 0) / 1000, 0); // Convert to km
    const teamBDistance = Object.values(matchStats.player_stats || {})
      .filter(player => player.team === 'Team B')
      .reduce((sum, player) => sum + (player.total_distance_m || 0) / 1000, 0);
    return {
      teamA: teamADistance / matchDurationHours,
      teamB: teamBDistance / matchDurationHours,
    };
  };

  const { teamA: teamAAvgSpeed, teamB: teamBAvgSpeed } = calculateAverageTeamSpeed();

  // Calculate sprint stats using speed_history
  const calculateSprintStats = () => {
    const playerSprints = Object.entries(matchStats.player_stats || {}).map(([id, stats]) => {
      let sprints = 0;
      const speedHistory = stats.speed_history || [];
      for (let i = 1; i < speedHistory.length; i++) {
        if (speedHistory[i] > 30 && speedHistory[i - 1] <= 30) {
          sprints++;
        }
      }
      const sprintDistance = speedHistory
        .filter(speed => speed > 30)
        .reduce((sum, speed) => sum + (speed / 3600 * 1 * 1000), 0) || 0; // Convert km/h to m/s for 1s sample
      const highIntensityRuns = speedHistory.filter(speed => speed > 20).length || 0;
      return {
        id,
        team: stats.team,
        sprints,
        sprintDistance,
        highIntensityRuns,
      };
    });

    const teamASprints = playerSprints
      .filter(player => player.team === 'Team A')
      .reduce((sum, player) => sum + player.sprints, 0);
    const teamBSprints = playerSprints
      .filter(player => player.team === 'Team B')
      .reduce((sum, player) => sum + player.sprints, 0);
    const teamASprintDistance = playerSprints
      .filter(player => player.team === 'Team A')
      .reduce((sum, player) => sum + player.sprintDistance, 0);
    const teamBSprintDistance = playerSprints
      .filter(player => player.team === 'Team B')
      .reduce((sum, player) => sum + player.sprintDistance, 0);
    const teamAHighIntensityRuns = playerSprints
      .filter(player => player.team === 'Team A')
      .reduce((sum, player) => sum + player.highIntensityRuns, 0);
    const teamBHighIntensityRuns = playerSprints
      .filter(player => player.team === 'Team B')
      .reduce((sum, player) => sum + player.highIntensityRuns, 0);

    return {
      playerSprints,
      teamASprints,
      teamBSprints,
      teamASprintDistance,
      teamBSprintDistance,
      teamAHighIntensityRuns,
      teamBHighIntensityRuns,
    };
  };

  const sprintStats = calculateSprintStats();

  const teamAMaxSpeedPlayer = Object.entries(matchStats.player_stats || {}).reduce((max, [id, stats]) => 
    stats.team === 'Team A' && stats.max_speed_kmph > (max.maxSpeed || 0) ? { id, maxSpeed: stats.max_speed_kmph } : max, {});
  const teamBMaxSpeedPlayer = Object.entries(matchStats.player_stats || {}).reduce((max, [id, stats]) => 
    stats.team === 'Team B' && stats.max_speed_kmph > (max.maxSpeed || 0) ? { id, maxSpeed: stats.max_speed_kmph } : max, {});

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">SPEED ANALYSIS</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-80 custom-scrollbar">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-white text-sm">Team A</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-white text-sm">Team B</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Average Team Speed</div>
            <div className="text-white text-2xl font-bold mt-2">{teamAAvgSpeed.toFixed(1)} km/h</div>
            <div className="text-blue-400 text-sm">Team A</div>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Average Team Speed</div>
            <div className="text-white text-2xl font-bold mt-2">{teamBAvgSpeed.toFixed(1)} km/h</div>
            <div className="text-pink-400 text-sm">Team B</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Max Speed Recorded</div>
            <div className="text-white text-2xl font-bold mt-2">{teamAMaxSpeedPlayer.maxSpeed?.toFixed(1) || 'N/A'} km/h</div>
            <div className="text-blue-400 text-sm">Team A (Player {teamAMaxSpeedPlayer.id || 'N/A'})</div>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Max Speed Recorded</div>
            <div className="text-white text-2xl font-bold mt-2">{teamBMaxSpeedPlayer.maxSpeed?.toFixed(1) || 'N/A'} km/h</div>
            <div className="text-pink-400 text-sm">Team B (Player {teamBMaxSpeedPlayer.id || 'N/A'})</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">SPRINT ANALYSIS</h3>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Sprints (&gt; 30 km/h)</span>
              <span className="text-white">{sprintStats.teamASprints} | {sprintStats.teamBSprints}</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: `${sprintStats.teamASprints / (sprintStats.teamASprints + sprintStats.teamBSprints || 1) * 100}%` }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: `${sprintStats.teamBSprints / (sprintStats.teamASprints + sprintStats.teamBSprints || 1) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Sprint Distance (m)</span>
              <span className="text-white">{sprintStats.teamASprintDistance.toFixed(1)} | {sprintStats.teamBSprintDistance.toFixed(1)}</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: `${sprintStats.teamASprintDistance / (sprintStats.teamASprintDistance + sprintStats.teamBSprintDistance || 1) * 100}%` }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: `${sprintStats.teamBSprintDistance / (sprintStats.teamASprintDistance + sprintStats.teamBSprintDistance || 1) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">High-Intensity Runs (&gt;20 km/h)</span>
              <span className="text-white">{sprintStats.teamAHighIntensityRuns} | {sprintStats.teamBHighIntensityRuns}</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: `${sprintStats.teamAHighIntensityRuns / (sprintStats.teamAHighIntensityRuns + sprintStats.teamBHighIntensityRuns || 1) * 100}%` }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: `${sprintStats.teamBHighIntensityRuns / (sprintStats.teamAHighIntensityRuns + sprintStats.teamBHighIntensityRuns || 1) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopPerformers({ matchStats, status }) {
  const [category, setCategory] = useState('distance');

  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">TOP PERFORMERS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching performer data...' : 'Performer data not available'}
        </div>
      </div>
    );
  }

  // Calculate player stats
  const playerData = Object.entries(matchStats.player_stats || {}).map(([id, stats]) => {
    let sprints = 0;
    const speedHistory = stats.speed_history || [];
    for (let i = 1; i < speedHistory.length; i++) {
      if (speedHistory[i] > 30 && speedHistory[i - 1] <= 30) {
        sprints++;
      }
    }
    return {
      id,
      team: stats.team,
      distance: stats.total_distance_m || 0, // In metres
      maxSpeed: stats.max_speed_kmph || 0,
      sprints,
      highIntensityRuns: speedHistory.filter(speed => speed > 20).length || 0, // High-intensity > 20 km/h
    };
  });

  const distanceData = playerData
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 5)
    .map((player, index) => ({
      player: `Player ${player.id}`,
      team: player.team,
      value: `${player.distance.toFixed(1)} m`,
      jersey: String(index + 1),
    }));

  const speedData = playerData
    .sort((a, b) => b.maxSpeed - a.maxSpeed)
    .slice(0, 5)
    .map((player, index) => ({
      player: `Player ${player.id}`,
      team: player.team,
      value: `${player.maxSpeed.toFixed(1)} km/h`,
      jersey: String(index + 1),
    }));

  const sprintsData = playerData
    .sort((a, b) => b.sprints - a.sprints)
    .slice(0, 5)
    .map((player, index) => ({
      player: `Player ${player.id}`,
      team: player.team,
      value: String(player.sprints),
      jersey: String(index + 1),
    }));

  const currentData = category === 'distance' ? distanceData : 
                      category === 'speed' ? speedData : 
                      sprintsData;

  // Calculate average team distance per player
  const teamAAvgDistance = playerData
    .filter(p => p.team === 'Team A')
    .reduce((sum, p) => sum + p.distance, 0) / (playerData.filter(p => p.team === 'Team A').length || 1);
  const teamBAvgDistance = playerData
    .filter(p => p.team === 'Team B')
    .reduce((sum, p) => sum + p.distance, 0) / (playerData.filter(p => p.team === 'Team B').length || 1);

  // Calculate high-speed runs (speed > 20 km/h)
  const highSpeedRuns = playerData.reduce(
    (acc, player) => ({
      teamA: player.team === 'Team A' ? acc.teamA + player.highIntensityRuns : acc.teamA,
      teamB: player.team === 'Team B' ? acc.teamB + player.highIntensityRuns : acc.teamB,
    }),
    { teamA: 0, teamB: 0 }
  );

  // Calculate sprint efficiency (sprints leading to goal attempts)
  const teamASprintGoalAttempts = matchStats.team_stats?.['Team A']?.sprint_goal_attempts || 0;
  const teamBSprintGoalAttempts = matchStats.team_stats?.['Team B']?.sprint_goal_attempts || 0;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">TOP PERFORMERS</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-80 custom-scrollbar">
        <div className="flex justify-between mb-4">
          <button 
            onClick={() => setCategory('distance')} 
            className={`px-3 py-1 ${category === 'distance' ? 'bg-cyan-600' : 'bg-gray-700'} text-white rounded-md text-sm font-medium`}
          >
            Distance
          </button>
          <button 
            onClick={() => setCategory('speed')} 
            className={`px-3 py-1 ${category === 'speed' ? 'bg-cyan-600' : 'bg-gray-700'} text-white rounded-md text-sm font-medium`}
          >
            Speed
          </button>
          <button 
            onClick={() => setCategory('sprints')} 
            className={`px-3 py-1 ${category === 'sprints' ? 'bg-cyan-600' : 'bg-gray-700'} text-white rounded-md text-sm font-medium`}
          >
            Sprints
          </button>
        </div>
        
        <div className="space-y-2">
          {currentData.map((item, index) => (
            <div key={index} className="flex items-center bg-gray-700 bg-opacity-30 p-3 rounded-lg">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white ${item.team === 'Team A' ? 'bg-blue-600' : 'bg-pink-600'}`}>
                {item.jersey}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <div className="text-white font-medium">{item.player}</div>
                  <div className="text-white font-bold">{item.value}</div>
                </div>
                <div className="text-sm text-gray-400">{item.team}</div>
              </div>
            </div>
          ))}
        </div>
        
        {category === 'distance' && (
          <div className="mt-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <div className="text-gray-400 text-sm font-semibold mb-2">TEAM AVERAGE DISTANCE</div>
            <div className="flex justify-between">
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-white">Team A: {teamAAvgDistance.toFixed(1)} m per player</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-white">Team B: {teamBAvgDistance.toFixed(1)} m per player</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {category === 'speed' && (
          <div className="mt-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <div className="text-gray-400 text-sm font-semibold mb-2">HIGH SPEED RUNS (&gt;20 KM/H)</div>
            <div className="flex justify-between">
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-white">Team A: {highSpeedRuns.teamA} runs</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-white">Team B: {highSpeedRuns.teamB} runs</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {category === 'sprints' && (
          <div className="mt-4 bg-gray-100 bg-opacity-30 p-3 rounded-lg">
            <div className="text-gray-400 text-sm font-semibold mb-2">SPRINT EFFICIENCY</div>
            <div className="flex justify-between">
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-white">Team A: {teamASprintGoalAttempts} goal attempts from sprints</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-white">Team B: {teamBSprintGoalAttempts} goal attempts from sprints</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TacticalAnalysisPage;