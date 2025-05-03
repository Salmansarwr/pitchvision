import React, { useState, useEffect, useContext } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

// Configuration for API calls
const API_BASE_URL = 'http://127.0.0.1:8000'; // Change this for production

function EventDetectionPage() {
  const { videoId } = useContext(UserContext);
  const [matchStats, setMatchStats] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setStatus('fetching');
        const token = localStorage.getItem('token');
        let selectedVideoId = videoId;

        if (videoId) {
          const response = await axios.get(`${API_BASE_URL}/api/videos/${videoId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.status !== 'completed') {
            console.warn(`Video ID ${videoId} is not completed (status: ${response.data.status}). Fetching latest completed video.`);
            selectedVideoId = null;
          }
        }

        if (!selectedVideoId) {
          const videosResponse = await axios.get(`${API_BASE_URL}/api/videos/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const completedVideo = videosResponse.data.find(video => video.status === 'completed');
          if (completedVideo) {
            selectedVideoId = completedVideo.id;
            console.log(`Selected latest completed video ID: ${selectedVideoId}`);
          } else {
            throw new Error('No completed videos found.');
          }
        }

        const videoResponse = await axios.get(`${API_BASE_URL}/api/videos/${selectedVideoId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideoData(videoResponse.data);
        setStatus(videoResponse.data.status);

        if (videoResponse.data.status === 'completed' && videoResponse.data.summary_json_url) {
          const summaryUrl = videoResponse.data.summary_json_url.startsWith('http')
            ? videoResponse.data.summary_json_url
            : `${API_BASE_URL}${videoResponse.data.summary_json_url.startsWith('/') ? '' : '/'}${videoResponse.data.summary_json_url}`;
          const summaryResponse = await axios.get(summaryUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Match summary response:', summaryResponse.data);
          setMatchStats(summaryResponse.data);
        } else {
          throw new Error('Match summary not available.');
        }
      } catch (error) {
        console.error('Failed to fetch match data:', error);
        setStatus('failed');
        setApiError(error.message || 'Failed to fetch match data. Please process a video first.');
      }
    };

    fetchMatchData();
  }, [videoId]);

  return (
    <Layout title="Event Detection">
      {apiError && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{apiError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <EventsSummary matchStats={matchStats} status={status} />
        <div className="md:col-span-2">
          <EventVideoClips matchStats={matchStats} status={status} eventFrameUrls={videoData?.event_frame_urls || []} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <EventDistribution matchStats={matchStats} status={status} />
        <EventFilters />
        <GoalAndPassingEvents matchStats={matchStats} status={status} />
      </div>
    </Layout>
  );
}

function EventsSummary({ matchStats, status }) {
  const teamAGoals = matchStats?.goals?.filter(g => g.team === 'Team A').length || 0;
  const teamBGoals = matchStats?.goals?.filter(g => g.team === 'Team B').length || 0;
  const teamAPasses = matchStats?.team_stats?.['Team A']?.passes || 0;
  const teamBPasses = matchStats?.team_stats?.['Team B']?.passes || 0;

  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">EVENT SUMMARY</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching event data...' : 'Event summary data not available'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">EVENT SUMMARY</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <EventStatCard type="Goals" teamA={teamAGoals} teamB={teamBGoals} />
          <EventStatCard type="Shots" teamA="12" teamB="8" />
        </div>
        <EventStatCard type="Passes" teamA={teamAPasses} teamB={teamBPasses} />
        
        <div className="mt-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-3">EVENT TIMELINE</h3>
          <div className="relative h-6 bg-gray-700 rounded-full w-full overflow-hidden">
            {matchStats.goals?.map((goal, index) => (
              <div
                key={index}
                className={`absolute h-full w-1 ${goal.team === 'Team A' ? 'bg-blue-500' : 'bg-pink-500'}`}
                style={{ left: `${(goal.frame / 5400) * 100}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>0'</span>
            <span>45'</span>
            <span>90'</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventStatCard({ type, teamA, teamB }) {
  return (
    <div className="bg-gray-700 bg-opacity-30 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-gray-400 text-sm">{type}</span>
        </div>
        <div className="text-white font-medium text-lg">{teamA} - {teamB}</div>
      </div>
    </div>
  );
}

function EventDistribution({ matchStats, status }) {
  const teamAGoals = matchStats?.goals?.filter(g => g.team === 'Team A').length || 0;
  const teamBGoals = matchStats?.goals?.filter(g => g.team === 'Team B').length || 0;
  const totalGoals = teamAGoals + teamBGoals;
  const totalPasses = (matchStats?.team_stats?.['Team A']?.passes || 0) + (matchStats?.team_stats?.['Team B']?.passes || 0);

  const data = status === 'completed' && matchStats ? [
    { name: 'Shots', value: 20 },
    { name: 'Passes', value: totalPasses },
    { name: 'Goals', value: totalGoals },
  ] : [
    { name: 'Shots', value: 20 },
    { name: 'Passes', value: 443 },
    { name: 'Goals', value: 3 },
  ];
  
  const COLORS = ['#3b82f6', '#e11d48', '#22c55e'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">EVENT DISTRIBUTION</h2>
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={65}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name]}
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4 w-full">
          {data.map((item, index) => (
            <div key={index} className="bg-gray-700 bg-opacity-30 p-3 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <div className={`h-3 w-3 rounded-full mr-1`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-gray-300 text-sm">{item.name}</span>
              </div>
              <div className="text-white text-center font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventVideoClips({ matchStats, status, eventFrameUrls }) {
  console.log('eventFrameUrls:', eventFrameUrls);
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">EVENT CLIPS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching event clips...' : 'Event clips data not available'}
        </div>
      </div>
    );
  }

  if (!eventFrameUrls.length) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">EVENT CLIPS</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          No event frames available
        </div>
      </div>
    );
  }

  const goalClips = matchStats.goals?.map((goal, index) => {
    let frameUrl = null;
    let logMessage = `Goal at frame ${goal.frame}: `;

    // Primary: Match by frame_number
    if (eventFrameUrls.length > 0 && typeof eventFrameUrls[0] === 'object' && 'frame_number' in eventFrameUrls[0]) {
      const matchingFrame = eventFrameUrls.find(frame => frame.frame_number === goal.frame);
      frameUrl = matchingFrame ? matchingFrame.url : null;
      logMessage += frameUrl ? `Found frame ${frameUrl} (frame_number match)` : 'No frame_number match';
    }

    // Fallback 1: Index-based (if no frame_number match)
    if (!frameUrl && eventFrameUrls[index]) {
      frameUrl = typeof eventFrameUrls[index] === 'object' ? eventFrameUrls[index].url : eventFrameUrls[index];
      logMessage += `Using index-based frame ${frameUrl}`;
    }

    // Fallback 2: URL parsing with flexible regex
    if (!frameUrl) {
      const matchingFrame = eventFrameUrls.find(item => {
        const url = typeof item === 'object' ? item.url : item;
        const match = url.match(/goal_Team%20[AB][_-](\d+)\.(jpg|png|jpeg)$/i);
        return match && parseInt(match[1]) === goal.frame;
      });
      frameUrl = matchingFrame ? (typeof matchingFrame === 'object' ? matchingFrame.url : matchingFrame) : null;
      logMessage += frameUrl ? `Found frame ${frameUrl} (URL parsing)` : 'No matching frame';
    }

    console.log(logMessage);
    return {
      time: Math.floor(goal.frame / 60),
      type: 'Goal',
      team: goal.team,
      player: goal.player_id || 'Unknown',
      frameUrl,
    };
  }) || [];

  // Dynamic grid columns based on number of clips
  const gridCols = goalClips.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">EVENT CLIPS</h2>
      </div>
      <div className="p-4">
        <div className={`grid ${gridCols} gap-4 auto-rows-fr`}>
          {goalClips.length ? (
            goalClips.map((clip, index) => (
              <VideoClip
                key={index}
                time={clip.time}
                type={clip.type}
                team={clip.team}
                player={clip.player}
                frameUrl={clip.frameUrl}
                clipCount={goalClips.length}
              />
            ))
          ) : (
            <div className="col-span-full text-gray-400 text-center">
              No goal clips available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoClip({ time, type, team, player, frameUrl, clipCount }) {
  const teamColor = team === 'Team A' ? 'bg-blue-600' : 'bg-pink-600';
  const [imageError, setImageError] = useState(null);

  // Dynamic height based on clip count
  const baseHeight = clipCount === 1 ? 'h-96' : clipCount === 2 ? 'h-48' : 'h-32';
  const imageHeight = clipCount === 1 ? 'h-80' : clipCount === 2 ? 'h-36' : 'h-24';

  return (
    <div className={`bg-gray-700 bg-opacity-30 rounded-lg p-3 flex flex-col ${baseHeight}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={`${teamColor} h-5 w-5 rounded-full mr-2`}></div>
          <span className="text-white font-medium">{time}' - {type}</span>
          <span className="text-gray-400 ml-2">({player})</span>
        </div>
        <button className="p-1 text-white bg-indigo-600 rounded-full h-6 w-6 flex items-center justify-center">
          ▶
        </button>
      </div>
      <div className={`bg-gray-900 rounded-md flex items-center justify-center relative flex-grow ${imageHeight}`}>
        {frameUrl ? (
          <>
            <img
              src={frameUrl}
              alt={`${type} at ${time}' by ${player}`}
              className="w-full h-full object-cover rounded-md"
              onError={() => setImageError('Failed to load image')}
            />
            {imageError && (
              <span className="text-red-500 absolute text-sm">{imageError}</span>
            )}
          </>
        ) : (
          <span className="text-gray-500">No event frame available</span>
        )}
      </div>
    </div>
  );
}

function EventFilters() {
  const [filters, setFilters] = useState({
    goals: true,
    shots: true,
    passes: false,
    teamA: true,
    teamB: true
  });
  
  const toggleFilter = (name) => {
    setFilters({
      ...filters,
      [name]: !filters[name]
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">EVENT FILTERS</h2>
      </div>
      <div className="p-4">
        <div>
          <h3 className="text-gray-400 text-sm font-semibold mb-3">EVENT TYPES</h3>
          <div className="space-y-3">
            <FilterToggle 
              label="Goals" 
              active={filters.goals} 
              onChange={() => toggleFilter('goals')} 
            />
            <FilterToggle 
              label="Shots" 
              active={filters.shots} 
              onChange={() => toggleFilter('shots')} 
            />
            <FilterToggle 
              label="Passes" 
              active={filters.passes} 
              onChange={() => toggleFilter('passes')} 
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-3">TEAMS</h3>
          <div className="space-y-3">
            <FilterToggle 
              label="Team A" 
              active={filters.teamA} 
              onChange={() => toggleFilter('teamA')} 
              color="bg-blue-600"
            />
            <FilterToggle 
              label="Team B" 
              active={filters.teamB} 
              onChange={() => toggleFilter('teamB')} 
              color="bg-pink-600"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full py-3 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterToggle({ label, active, onChange, color = 'bg-indigo-600' }) {
  return (
    <div className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-3 rounded-lg">
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${color}`}></div>
        <span className="text-gray-300">{label}</span>
      </div>
      <button 
        className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${active ? 'bg-green-600' : 'bg-gray-600'}`}
        onClick={onChange}
      >
        <div 
          className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-1'}`} 
        />
      </button>
    </div>
  );
}

function GoalAndPassingEvents({ matchStats, status }) {
  if (status !== 'completed' || !matchStats) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
        <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
          <h2 className="text-gray-400 font-semibold">GOALS & PASSES</h2>
        </div>
        <div className="p-4 text-gray-400 text-center">
          {status === 'fetching' ? 'Fetching goals and passes...' : 'Goals and passes data not available'}
        </div>
      </div>
    );
  }

  const teamAGoals = matchStats.goals?.filter(g => g.team === 'Team A') || [];
  const teamBGoals = matchStats.goals?.filter(g => g.team === 'Team B') || [];
  const teamAPasses = matchStats.passes?.filter(p => p.team === 'Team A') || [];
  const teamBPasses = matchStats.passes?.filter(p => p.team === 'Team B') || [];

  const categorizePasses = (passes) => {
    const shortPasses = passes.filter(p => (p.distance || 0) < 10).length;
    const mediumPasses = passes.filter(p => (p.distance || 0) >= 10 && (p.distance || 0) < 30).length;
    const longPasses = passes.filter(p => (p.distance || 0) >= 30).length;
    return { short: shortPasses, medium: mediumPasses, long: longPasses };
  };

  const teamAPassTypes = categorizePasses(teamAPasses);
  const teamBPassTypes = categorizePasses(teamBPasses);

  const passData = [
    { name: 'Short', teamA: teamAPassTypes.short || 156, teamB: teamBPassTypes.short || 125 },
    { name: 'Medium', teamA: teamAPassTypes.medium || 68, teamB: teamBPassTypes.medium || 53 },
    { name: 'Long', teamA: teamAPassTypes.long || 21, teamB: teamBPassTypes.long || 20 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">GOALS & PASSES</h2>
      </div>
      <div className="p-4">
        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg mb-3">
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-white font-medium">Team A Goals: {teamAGoals.length}</span>
          </div>
          <div className="text-sm text-gray-400">
            {teamAGoals.length ? (
              teamAGoals.map((goal, index) => (
                <span key={index}>
                  {Math.floor(goal.frame / 60)}' - Player #{goal.player_id || 'Unknown'}
                  {index < teamAGoals.length - 1 ? ' • ' : ''}
                </span>
              ))
            ) : (
              'No goals'
            )}
          </div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg mb-5">
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-white font-medium">Team B Goals: {teamBGoals.length}</span>
          </div>
          <div className="text-sm text-gray-400">
            {teamBGoals.length ? (
              teamBGoals.map((goal, index) => (
                <span key={index}>
                  {Math.floor(goal.frame / 60)}' - Player #{goal.player_id || 'Unknown'}
                  {index < teamBGoals.length - 1 ? ' • ' : ''}
                </span>
              ))
            ) : (
              'No goals'
            )}
          </div>
        </div>
        
        <h3 className="text-gray-400 text-sm font-semibold mb-3">PASS TYPES</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={passData}
              layout="vertical"
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Bar dataKey="teamA" name="Team A" stackId="a" fill="#3b82f6" />
              <Bar dataKey="teamB" name="Team B" stackId="a" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default EventDetectionPage;