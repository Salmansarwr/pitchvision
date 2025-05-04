import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

// Configuration for API calls
const API_BASE_URL = 'http://127.0.0.1:8000'; // Change this for production

// Field dimensions
const FIELD_WIDTH = 527;
const FIELD_HEIGHT = 351;

// Heatmap utility functions
const fetchObjectTracks = async (objectTracksUrl) => {
  try {
    const response = await axios.get(objectTracksUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching object tracks:', error);
    return [];
  }
};

const extractPlayerPositions = (objectTracks, playerId) => {
  const positions = [];
  objectTracks.forEach((frameData, frameIdx) => {
    if (frameData?.player && frameData.player[playerId]) {
      const playerInfo = frameData.player[playerId];
      if (playerInfo.projection && Array.isArray(playerInfo.projection)) {
        const [x, y] = playerInfo.projection;
        if ((x !== 0 || y !== 0) && x >= 0 && y >= 0) {
          positions.push({
            x: x,
            y: y, // Flip Y-axis
            time: frameIdx / 30, // Assuming 30 fps
            speed: playerInfo.speed || 0
          });
        }
      }
    }
  });
  return positions;
};

const generateHeatmapData = (positions, gridSize = 20) => {
  const heatmap = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  const xStep = FIELD_WIDTH / gridSize;
  const yStep = FIELD_HEIGHT / gridSize;
  positions.forEach(pos => {
    const xIndex = Math.min(Math.floor(pos.x / xStep), gridSize - 1);
    const yIndex = Math.min(Math.floor(pos.y / yStep), gridSize - 1);
    if (xIndex >= 0 && yIndex >= 0) {
      heatmap[yIndex][xIndex]++;
    }
  });
  return heatmap;
};

const calculateZoneDistribution = (positions) => {
  const zones = {
    defensive: 0,
    middle: 0,
    attacking: 0
  };
  positions.forEach(pos => {
    if (pos.x < FIELD_WIDTH / 3) {
      zones.defensive++;
    } else if (pos.x < (2 * FIELD_WIDTH) / 3) {
      zones.middle++;
    } else {
      zones.attacking++;
    }
  });
  const total = positions.length || 1;
  return {
    defensive: Math.round((zones.defensive / total) * 100),
    middle: Math.round((zones.middle / total) * 100),
    attacking: Math.round((zones.attacking / total) * 100)
  };
};

const calculateFlankPreference = (positions) => {
  const flanks = {
    left: 0,
    center: 0,
    right: 0
  };
  positions.forEach(pos => {
    if (pos.y < FIELD_HEIGHT / 3) {
      flanks.left++;
    } else if (pos.y < (2 * FIELD_HEIGHT) / 3) {
      flanks.center++;
    } else {
      flanks.right++;
    }
  });
  const total = positions.length || 1;
  return {
    left: Math.round((flanks.left / total) * 100),
    center: Math.round((flanks.center / total) * 100),
    right: Math.round((flanks.right / total) * 100)
  };
};

// Simpler AnalysisCard component 
function AnalysisCard({ title, stats }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">{title}</h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-gray-400 text-xs">{stat.label}</div>
              <div className="text-white text-xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerTrackingPage() {
  const { videoId } = useContext(UserContext);
  const [localVideoId, setLocalVideoId] = useState(videoId);
  const [matchStats, setMatchStats] = useState(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'fetching', 'completed', 'failed'
  const [apiError, setApiError] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null); // Default player ID will be set after data fetch

  // Fetch or validate video ID
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setStatus('fetching');
        const token = localStorage.getItem('token');
        let selectedVideoId = videoId;

        // Validate videoId from UserContext
        if (videoId) {
          const response = await axios.get(`${API_BASE_URL}/api/videos/${videoId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.status !== 'completed') {
            console.warn(`Video ID ${videoId} is not completed (status: ${response.data.status}). Fetching latest completed video.`);
            selectedVideoId = null;
          }
        }

        // If no valid videoId, fetch the latest completed video
        if (!selectedVideoId) {
          const videosResponse = await axios.get(`${API_BASE_URL}/api/videos/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const completedVideo = videosResponse.data.find(video => video.status === 'completed');
          if (completedVideo) {
            selectedVideoId = completedVideo.id;
          } else {
            throw new Error('No completed videos found.');
          }
        }

        setLocalVideoId(selectedVideoId);
        const response = await axios.get(`${API_BASE_URL}/api/videos/${selectedVideoId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Check status periodically
  useEffect(() => {
    let interval;
    if (localVideoId && (status === 'processing' || status === 'uploading')) {
      interval = setInterval(() => checkStatus(localVideoId), 5000);
    }
    return () => clearInterval(interval);
  }, [localVideoId, status]);

  // Fetch match summary data when results are available
  useEffect(() => {
    if (results?.summary && status === 'completed') {
      const fetchMatchSummary = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(results.summary, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMatchStats(response.data);
          // Set default player as the first player from Team A
          const teamAPlayers = Object.entries(response.data.player_stats || {})
            .filter(([, stats]) => stats.team === 'Team A');
          if (teamAPlayers.length > 0) {
            setSelectedPlayerId(teamAPlayers[0][0]);
          }
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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/videos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    <Layout title="Player Tracking">
      {apiError && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{apiError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <PlayerSelector 
          matchStats={matchStats} 
          status={status} 
          selectedPlayerId={selectedPlayerId} 
          setSelectedPlayerId={setSelectedPlayerId} 
        />
        <div className="lg:col-span-2">
          <PerformanceOverview 
            matchStats={matchStats} 
            status={status} 
            selectedPlayerId={selectedPlayerId} 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <HeatmapView 
            selectedPlayerId={selectedPlayerId}
            results={results}
          />
        </div>
        <PositionalData 
          selectedPlayerId={selectedPlayerId}
          results={results}
        />
      </div>
    </Layout>
  );
}

function PlayerSelector({ matchStats, status, selectedPlayerId, setSelectedPlayerId }) {
  const [team, setTeam] = useState('Team A');

  // Divide players into teams
  const teamAPlayers = matchStats ? Object.entries(matchStats.player_stats || {})
    .filter(([, stats]) => stats.team === 'Team A')
    .map(([id]) => id) : [];
  const teamBPlayers = matchStats ? Object.entries(matchStats.player_stats || {})
    .filter(([, stats]) => stats.team === 'Team B')
    .map(([id]) => id) : [];

  const players = team === 'Team A' ? teamAPlayers : teamBPlayers;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PLAYER SELECTION</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Team
          </label>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setTeam('Team A');
                if (teamAPlayers.length > 0) setSelectedPlayerId(teamAPlayers[0]);
              }} 
              className={`flex-1 py-2 rounded-md ${team === 'Team A' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Team A
            </button>
            <button 
              onClick={() => {
                setTeam('Team B');
                if (teamBPlayers.length > 0) setSelectedPlayerId(teamBPlayers[0]);
              }} 
              className={`flex-1 py-2 rounded-md ${team === 'Team B' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Team B
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Player
          </label>
          <select 
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md custom-scrollbar"
            value={selectedPlayerId || ''}
            onChange={e => setSelectedPlayerId(e.target.value)}
            disabled={status !== 'completed' || !matchStats}
          >
            {players.length > 0 ? (
              players.map(id => (
                <option key={id} value={id}>Player #{id}</option>
              ))
            ) : (
              <option disabled>No players available</option>
            )}
          </select>
        </div>
        
        <div className="flex flex-col items-center mt-6">
          <div className={`h-24 w-24 rounded-full ${team === 'Team A' ? 'bg-blue-600' : 'bg-pink-600'} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-4xl font-bold">{selectedPlayerId || '10'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceOverview({ matchStats, status, selectedPlayerId }) {
  if (status !== 'completed' || !matchStats || !selectedPlayerId) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">PERFORMANCE OVERVIEW</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching performance data...' : 'Performance data not available'}
        </div>
      </div>
    );
  }

  const playerStats = matchStats.player_stats?.[selectedPlayerId] || {};
  const totalDistance = playerStats.total_distance_m || 0; // Keep in meters
  const maxSpeed = playerStats.max_speed_kmph || 0;

  // Calculate sprints (speed > 25 km/h)
  const sprints = playerStats.speed_history?.filter(speed => speed > 25).length || 0;

  // Calculate acceleration and deceleration
  let accelerations = 0;
  let decelerations = 0;
  if (playerStats.speed_history?.length) {
    for (let i = 1; i < playerStats.speed_history.length; i++) {
      const speedDiff = playerStats.speed_history[i] - playerStats.speed_history[i - 1];
      // Assuming speed_history is sampled every second, speedDiff is in km/h per second
      if (speedDiff > 5) accelerations++; // Significant speed increase
      if (speedDiff < -5) decelerations++; // Significant speed decrease
    }
  }

  // Calculate Fatigue Index
  let fatigueIndex = 'N/A';
  if (playerStats.speed_history?.length) {
    // Default body weight (in kg)
    const bodyWeight = 70;
    // Convert speeds to m/s and calculate power (proportional to speed^3)
    const sprintSpeeds = playerStats.speed_history
      .map((speed, index) => ({ speed, index }))
      .filter(({ speed }) => speed > 25) // Sprints only
      .map(({ speed, index }) => ({
        index,
        speedMs: speed * (1000 / 3600), // Convert km/h to m/s
      }))
      .map(({ index, speedMs }) => ({
        index,
        power: bodyWeight * Math.pow(speedMs, 3), // Simplified power estimate
      }));

    if (sprintSpeeds.length >= 2) {
      const maxPower = Math.max(...sprintSpeeds.map(s => s.power));
      const minPower = Math.min(...sprintSpeeds.map(s => s.power));
      fatigueIndex = ((maxPower - minPower) / maxPower) * 100;
      fatigueIndex = fatigueIndex.toFixed(1) + '%';
    } else {
      fatigueIndex = 'Insufficient sprint data';
    }
  }

  // Simulate speed history over time if available
  const speedHistory = playerStats.speed_history?.length ? playerStats.speed_history.map((speed, index) => ({
    minute: `${index * 15}-${(index + 1) * 15}`,
    speed
  })) : [
    { minute: '0-15', speed: 28 },
    { minute: '15-30', speed: 30 },
    { minute: '30-45', speed: 26 },
    { minute: '45-60', speed: 32 },
    { minute: '60-75', speed: 29 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PERFORMANCE OVERVIEW</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-96 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Distance" value={`${totalDistance.toFixed(0)} m`} />
          <MetricCard label="Top Speed" value={`${maxSpeed.toFixed(1)} km/h`} />
          <MetricCard label="Sprints" value={sprints} />
          <MetricCard label="Accel/Decel" value={`${accelerations}/${decelerations}`} />
        </div>
        
        <div className="mt-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-3">PERFORMANCE METRICS OVER TIME</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={speedHistory}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="minute" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Area type="monotone" dataKey="speed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeed)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
          <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-400 text-sm">Fatigue Index</h4>
              <span className="text-yellow-400 text-sm">{fatigueIndex}</span>
            </div>
            <div className="h-2 w-full bg-gray-600 rounded-full">
              {fatigueIndex !== 'N/A' && fatigueIndex !== 'Insufficient sprint data' ? (
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: fatigueIndex }}></div>
              ) : (
                <div className="h-full bg-gray-500 rounded-full" style={{ width: '0%' }}></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-white text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function HeatmapView({ selectedPlayerId, results }) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [zoneDistribution, setZoneDistribution] = useState({
    defensive: 0,
    middle: 0,
    attacking: 0
  });
  const [flankPreference, setFlankPreference] = useState({
    left: 0,
    center: 0,
    right: 0
  });

  const fetchHeatmapData = useCallback(async () => {
    try {
      const objectTracks = await fetchObjectTracks(results.objectTracks);
      const playerPositions = extractPlayerPositions(objectTracks, selectedPlayerId);
      const heatmap = generateHeatmapData(playerPositions);
      setHeatmapData(heatmap);
      
      const zones = calculateZoneDistribution(playerPositions);
      setZoneDistribution(zones);
      
      const flanks = calculateFlankPreference(playerPositions);
      setFlankPreference(flanks);
    } catch (error) {
      console.error('Error processing heatmap data:', error);
    }
  }, [results?.objectTracks, selectedPlayerId]);

  useEffect(() => {
    if (selectedPlayerId && results?.objectTracks) {
      fetchHeatmapData();
    }
  }, [selectedPlayerId, results, fetchHeatmapData]);

  const renderHeatmap = () => {
    if (!heatmapData) return null;
    const maxValue = Math.max(...heatmapData.flat());

    return heatmapData.map((row, rowIndex) => (
      row.map((value, colIndex) => {
        const intensity = value / maxValue;
        const opacity = Math.min(intensity * 0.8, 0.8);
        
        let color;
        if (intensity < 0.2) color = 'rgba(30, 160, 80, '; // Darker green
        else if (intensity < 0.4) color = 'rgba(220, 180, 50, '; // Darker yellow
        else if (intensity < 0.6) color = 'rgba(210, 120, 50, '; // Darker orange
        else color = 'rgba(200, 50, 50, '; // Darker red
        
        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="absolute"
            style={{
              left: `${(colIndex / 20) * 100}%`,
              top: `${(rowIndex / 20) * 100}%`,
              width: '5%',
              height: '5%',
              backgroundColor: value > 0 ? color + opacity + ')' : 'transparent',
              pointerEvents: 'none'
            }}
          />
        );
      })
    ));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PLAYER MOVEMENT ANALYSIS</h2>
      </div>
      <div className="p-4 flex justify-center overflow-auto custom-scrollbar">
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 left-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 right-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          
          {renderHeatmap()}
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-2">ZONE DISTRIBUTION</h3>
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Def</div>
                <div className="text-white font-medium">{zoneDistribution.defensive}%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Mid</div>
                <div className="text-white font-medium">{zoneDistribution.middle}%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Att</div>
                <div className="text-white font-medium">{zoneDistribution.attacking}%</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-2">FLANK PREFERENCE</h3>
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Left</div>
                <div className="text-white font-medium">{flankPreference.left}%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Center</div>
                <div className="text-white font-medium">{flankPreference.center}%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Right</div>
                <div className="text-white font-medium">{flankPreference.right}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionalData({ selectedPlayerId, results }) {
  const [positionalData, setPositionalData] = useState({
    avgPosition: { x: 0, y: 0 },
    positionVariance: 0
  });

  const fetchPositionalData = useCallback(async () => {
    try {
      const objectTracks = await fetchObjectTracks(results.objectTracks);
      const positions = [];

      // Extract bounding box centers
      objectTracks.forEach((frameData) => {
        if (frameData?.player && frameData.player[selectedPlayerId]) {
          const playerInfo = frameData.player[selectedPlayerId];
          if (playerInfo.bbox && Array.isArray(playerInfo.bbox)) {
            const [x1, y1, x2, y2] = playerInfo.bbox;
            const xCenter = (x1 + x2) / 2;
            const yCenter = (y1 + y2) / 2;
            if (xCenter >= 0 && yCenter >= 0) {
              positions.push({
                x: xCenter,
                y: yCenter
              });
            }
          }
        }
      });

      if (positions.length === 0) {
        setPositionalData({
          avgPosition: { x: 0, y: 0 },
          positionVariance: 0
        });
        return;
      }

      // Convert to meters (assuming field is 105m x 68m)
      const xScale = 105 / FIELD_WIDTH; // meters per pixel
      const yScale = 68 / FIELD_HEIGHT; // meters per pixel

      const positionsInMeters = positions.map(pos => ({
        x: pos.x * xScale,
        y: pos.y * yScale
      }));

      // Calculate average position
      const avgX = positionsInMeters.reduce((sum, pos) => sum + pos.x, 0) / positionsInMeters.length;
      const avgY = positionsInMeters.reduce((sum, pos) => sum + pos.y, 0) / positionsInMeters.length;

      // Calculate variance
      const varianceX = positionsInMeters.reduce((sum, pos) => sum + Math.pow(pos.x - avgX, 2), 0) / positionsInMeters.length;
      const varianceY = positionsInMeters.reduce((sum, pos) => sum + Math.pow(pos.y - avgY, 2), 0) / positionsInMeters.length;
      const combinedVariance = (varianceX + varianceY) / 2;

      // Classify variance
      const varianceThresholds = {
        low: 10,
        medium: 20
      };
      let varianceLabel;
      if (combinedVariance < varianceThresholds.low) {
        varianceLabel = 'Low';
      } else if (combinedVariance < varianceThresholds.medium) {
        varianceLabel = 'Medium';
      } else {
        varianceLabel = 'High';
      }

      setPositionalData({
        avgPosition: { x: avgX.toFixed(1), y: avgY.toFixed(1) },
        positionVariance: `${varianceLabel} (${combinedVariance.toFixed(1)})`
      });
    } catch (error) {
      console.error('Error processing positional data:', error);
      setPositionalData({
        avgPosition: { x: 0, y: 0 },
        positionVariance: 'N/A'
      });
    }
  }, [results?.objectTracks, selectedPlayerId]);

  useEffect(() => {
    if (selectedPlayerId && results?.objectTracks) {
      fetchPositionalData();
    }
  }, [selectedPlayerId, results, fetchPositionalData]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">POSITIONAL DATA</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">POSITIONING</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <div className="text-gray-400 text-xs">Avg Position (X, Y)</div>
              <div className="text-white font-medium">{`${positionalData.avgPosition.x}m, ${positionalData.avgPosition.y}m`}</div>
            </div>
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <div className="text-gray-400 text-xs">Position Variance</div>
              <div className="text-white font-medium">{positionalData.positionVariance}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerTrackingPage;