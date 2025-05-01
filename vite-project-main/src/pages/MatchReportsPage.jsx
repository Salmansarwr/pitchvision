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

function MatchReportsPage() {
  const { User, videoId } = useContext(UserContext);
  const [matchStats, setMatchStats] = useState(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'fetching', 'completed', 'failed'
  const [apiError, setApiError] = useState(null);

  // Fetch video data using UserContext videoId
  useEffect(() => {
    console.log('UserContext videoId in MatchReportsPage:', videoId);
    if (videoId) {
      const fetchVideoData = async () => {
        try {
          setStatus('fetching');
          const token = localStorage.getItem('token');
          console.log(`Fetching video data for videoId: ${videoId}`);
          const response = await axios.get(`${API_BASE_URL}/api/videos/${videoId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Video data response:', response.data);
          setStatus(response.data.status);
          checkStatus(videoId);
        } catch (error) {
          console.error('Failed to fetch video data:', error);
          setStatus('failed');
          setApiError('Failed to fetch video data. Please ensure a valid video is processed.');
        }
      };
      fetchVideoData();
    } else {
      setStatus('failed');
      setApiError('No video ID available. Please process a video in the Dashboard.');
    }
  }, [videoId]);

  // Check status periodically
  useEffect(() => {
    let interval;
    if (videoId && (status === 'processing' || status === 'uploading')) {
      interval = setInterval(() => checkStatus(videoId), 5000);
    }
    return () => clearInterval(interval);
  }, [videoId, status]);

  // Fetch match summary data when results are available
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
    <Layout title="Match Reports">
      {apiError && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{apiError}</p>
        </div>
      )}
      <PageHeader results={results} />
      <div className="mt-4">
        <MatchSummary matchStats={matchStats} status={status} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TeamStatistics matchStats={matchStats} status={status} />
        <PlayerStatistics matchStats={matchStats} status={status} />
      </div>
      <div className="mt-4">
        <PassEvents matchStats={matchStats} status={status} />
      </div>
    </Layout>
  );
}

// Page-specific components
function PageHeader({ results }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
      <div className="flex items-center">
        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        <span className="ml-2 text-white font-bold">MATCH REPORTS</span>
      </div>
      <div className="mx-6 h-10 border-l border-gray-600"></div>
      <div className="text-white overflow-x-auto custom-scrollbar">
        Generate detailed data-driven match reports
      </div>
      <div className="ml-auto flex space-x-3">
        <button className="px-4 py-2 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition">
          Generate Report
        </button>
        {results?.summary && (
          <a
            href={results.summary}
            download
            className="px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          >
            Export JSON
          </a>
        )}
      </div>
    </div>
  );
}

function MatchSummary({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">MATCH SUMMARY</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching match data...' : 'Match summary data not available'}
        </div>
      </div>
    );
  }

  const teamAGoals = matchStats.goals?.filter(g => g.team === 'Team A').length || 0;
  const teamBGoals = matchStats.goals?.filter(g => g.team === 'Team B').length || 0;
  const teamAPossession = matchStats.team_stats?.['Team A']?.possession_percentage || 0;
  const teamBPossession = matchStats.team_stats?.['Team B']?.possession_percentage || 0;
  const teamAPasses = matchStats.team_stats?.['Team A']?.passes || 0;
  const teamBPasses = matchStats.team_stats?.['Team B']?.passes || 0;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">MATCH SUMMARY</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-80 custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              TA
            </div>
            <span className="mt-2 text-gray-400">Team A</span>
          </div>
          
          <div className="text-center">
            <div className="text-white text-4xl font-bold">
              {teamAGoals} - {teamBGoals}
            </div>
            <div className="text-cyan-400 text-sm mt-1">
              Match ID: {matchStats.match_id || 'N/A'} • {new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
              TB
            </div>
            <span className="mt-2 text-gray-400">Team B</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-700 bg-opacity-30 p-2 rounded text-center">
            <div className="text-gray-400 text-xs">Possession</div>
            <div className="text-white font-medium">{teamAPossession}% - {teamBPossession}%</div>
          </div>
          <div className="bg-gray-700 bg-opacity-30 p-2 rounded text-center">
            <div className="text-gray-400 text-xs">Goals</div>
            <div className="text-white font-medium">{teamAGoals} - {teamBGoals}</div>
          </div>
          <div className="bg-gray-700 bg-opacity-30 p-2 rounded text-center">
            <div className="text-gray-400 text-xs">Passes</div>
            <div className="text-white font-medium">{teamAPasses} - {teamBPasses}</div>
          </div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg mb-4">
          <h3 className="text-white text-sm font-medium mb-2">Goal Details</h3>
          <div className="space-y-2 text-sm">
            {matchStats.goals?.length ? (
              matchStats.goals.map((goal, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-400">{goal.team} (Frame {goal.frame})</span>
                  <span className="text-white">Player ID: {goal.player_id || 'Unknown'}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No goals scored</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamStatistics({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">TEAM STATISTICS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching team statistics...' : 'Team statistics data not available'}
        </div>
      </div>
    );
  }

  const teamAPossession = matchStats.team_stats?.['Team A']?.possession_percentage || 0;
  const teamBPossession = matchStats.team_stats?.['Team B']?.possession_percentage || 0;
  const teamAPasses = matchStats.team_stats?.['Team A']?.passes || 0;
  const teamBPasses = matchStats.team_stats?.['Team B']?.passes || 0;
  const teamAGoals = matchStats.goals?.filter(g => g.team === 'Team A').length || 0;
  const teamBGoals = matchStats.goals?.filter(g => g.team === 'Team B').length || 0;

  // Simulate possession timeline data if not available
  const possessionTimeline = matchStats.possession_timeline?.length ? matchStats.possession_timeline : [
    { frame: 900, teamA: teamAPossession, teamB: teamBPossession },
    { frame: 1800, teamA: teamAPossession - 3, teamB: teamBPossession + 3 },
    { frame: 2700, teamA: teamAPossession - 2, teamB: teamBPossession + 2 },
    { frame: 3600, teamA: teamAPossession + 2, teamB: teamBPossession - 2 },
    { frame: 4500, teamA: teamAPossession - 1, teamB: teamBPossession + 1 },
    { frame: 5400, teamA: teamAPossession, teamB: teamBPossession },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">TEAM STATISTICS</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-96 custom-scrollbar">
        <h3 className="text-white text-sm font-medium mb-3">Team Performance</h3>
        
        <div className="space-y-4">
          <StatComparisonBar 
            label="Possession %" 
            team1Value={teamAPossession} 
            team2Value={teamBPossession} 
            maxValue={100} 
          />
          <StatComparisonBar 
            label="Passes" 
            team1Value={teamAPasses} 
            team2Value={teamBPasses} 
            maxValue={Math.max(teamAPasses, teamBPasses, 600)} 
          />
          <StatComparisonBar 
            label="Goals" 
            team1Value={teamAGoals} 
            team2Value={teamBGoals} 
            maxValue={Math.max(teamAGoals, teamBGoals, 5)} 
          />
        </div>
        
        <div className="mt-6">
          <h3 className="text-white text-sm font-medium mb-3">Possession Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={possessionTimeline}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="frame" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Line type="monotone" dataKey="teamA" name="Team A" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="teamB" name="Team B" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatComparisonBar({ label, team1Value, team2Value, maxValue, decimals = 0 }) {
  const team1Percent = (team1Value / maxValue) * 100;
  const team2Percent = (team2Value / maxValue) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <div className="flex space-x-4">
          <span className="text-blue-400">{team1Value.toFixed(decimals)}</span>
          <span className="text-pink-400">{team2Value.toFixed(decimals)}</span>
        </div>
      </div>
      <div className="h-2 w-full bg-gray-700 rounded-full flex">
        <div 
          className="h-full bg-blue-500 rounded-l-full" 
          style={{ width: `${team1Percent}%` }}
        ></div>
        <div 
          className="h-full bg-pink-500 rounded-r-full" 
          style={{ width: `${team2Percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function PlayerStatistics({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">PLAYER STATISTICS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching player statistics...' : 'Player statistics data not available'}
        </div>
      </div>
    );
  }

  const playerData = Object.entries(matchStats.player_stats || {}).map(([id, stats]) => ({
    id,
    team: stats.team,
    distance: (stats.total_distance_m || 0) / 1000, // Convert to km
    maxSpeed: stats.max_speed_kmph || 0,
    avgSpeed: stats.avg_speed_kmph || 0,
  }));

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PLAYER STATISTICS</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-96 custom-scrollbar">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 bg-opacity-30 rounded-lg">
            <thead>
              <tr className="text-sm text-gray-400">
                <th className="px-4 py-2 text-left">Player ID</th>
                <th className="px-4 py-2 text-center">Team</th>
                <th className="px-4 py-2 text-center">Distance (km)</th>
                <th className="px-4 py-2 text-center">Max Speed (km/h)</th>
                <th className="px-4 py-2 text-center">Avg Speed (km/h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {playerData.length ? (
                playerData.map(player => (
                  <tr key={player.id} className="text-white">
                    <td className="px-4 py-3 text-left">{player.id}</td>
                    <td className="px-4 py-3 text-center">
                      <div className={`mx-auto h-6 w-6 rounded-full ${player.team === 'Team A' ? 'bg-blue-600' : 'bg-pink-600'} flex items-center justify-center text-white text-xs`}>
                        {player.team === 'Team A' ? 'A' : 'B'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{player.distance.toFixed(1)}</td>
                    <td className="px-4 py-3 text-center">{player.maxSpeed.toFixed(1)}</td>
                    <td className="px-4 py-3 text-center">{player.avgSpeed.toFixed(1)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
                    No player data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PassEvents({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">PASS EVENTS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching pass events...' : 'Pass events data not available'}
        </div>
      </div>
    );
  }

  const passData = matchStats.passes?.map((pass, index) => ({
    id: index + 1,
    frame: pass.frame,
    fromPlayer: pass.from_player_id || 'Unknown',
    toPlayer: pass.to_player_id || 'Unknown',
    team: pass.team,
  })) || [];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PASS EVENTS</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-96 custom-scrollbar">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 bg-opacity-30 rounded-lg">
            <thead>
              <tr className="text-sm text-gray-400">
                <th className="px-4 py-2 text-left">Frame</th>
                <th className="px-4 py-2 text-left">From Player</th>
                <th className="px-4 py-2 text-left">To Player</th>
                <th className="px-4 py-2 text-center">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {passData.length ? (
                passData.map(pass => (
                  <tr key={pass.id} className="text-white">
                    <td className="px-4 py-3 text-left">{pass.frame}</td>
                    <td className="px-4 py-3 text-left">{pass.fromPlayer}</td>
                    <td className="px-4 py-3 text-left">{pass.toPlayer}</td>
                    <td className="px-4 py-3 text-center">
                      <div className={`mx-auto h-6 w-6 rounded-full ${pass.team === 'Team A' ? 'bg-blue-600' : 'bg-pink-600'} flex items-center justify-center text-white text-xs`}>
                        {pass.team === 'Team A' ? 'A' : 'B'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-400">
                    No pass data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MatchReportsPage;