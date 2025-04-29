import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';

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
  return (
    <Layout title="Player Tracking">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <PlayerSelector />
        <div className="lg:col-span-2">
          <PerformanceOverview />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <HeatmapView />
        </div>
        <PositionalData />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <SpeedTracker />
        <DistanceCoverage />
        <div className="md:col-span-2 lg:col-span-1">
          <div className="grid grid-cols-1 gap-4">
            <PassingAnalysis />
            <GoalsScored />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PlayerSelector() {
  const [team, setTeam] = useState('teamA');
  const [player, setPlayer] = useState('Player #10');
  
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
              onClick={() => setTeam('teamA')} 
              className={`flex-1 py-2 rounded-md ${team === 'teamA' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Team A
            </button>
            <button 
              onClick={() => setTeam('teamB')} 
              className={`flex-1 py-2 rounded-md ${team === 'teamB' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Team B
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-400 text SM font-medium mb-2">
            Player
          </label>
          <select 
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md custom-scrollbar"
            value={player}
            onChange={e => setPlayer(e.target.value)}
          >
            <option>Player #10</option>
            <option>Player #7</option>
            <option>Player #9</option>
            <option>Player #4</option>
            <option>Player #8</option>
            <option>Player #1</option>
          </select>
        </div>
        
        <div className="flex flex-col items-center mt-6">
          <div className={`h-24 w-24 rounded-full ${team === 'teamA' ? 'bg-blue-600' : 'bg-pink-600'} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-4xl font-bold">10</span>
          </div>
          <h3 className="text-white text-xl font-medium mt-3">Juan Mendez</h3>
          <p className="text-gray-400">Attacking Midfielder</p>
        </div>
      </div>
    </div>
  );
}

function PerformanceOverview() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PERFORMANCE OVERVIEW</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-96 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Distance" value="8.7 km" trend="+0.8" />
          <MetricCard label="Top Speed" value="32.1 km/h" trend="+1.2" />
          <MetricCard label="Sprints" value="23" trend="-2" isNegative={true} />
          <MetricCard label="Accel/Decel" value="129/122" trend="+8" />
        </div>
        
        <div className="mt-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-3">PERFORMANCE METRICS OVER TIME</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={[
                { minute: '0-15', speed: 28, distance: 2.1 },
                { minute: '15-30', speed: 30, distance: 2.3 },
                { minute: '30-45', speed: 26, distance: 1.9 },
                { minute: '45-60', speed: 32, distance: 2.4 },
                { minute: '60-75', speed: 29, distance: 2.2 },
              ]}
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
              <span className="text-yellow-400 text-sm">72%</span>
            </div>
            <div className="h-2 w-full bg-gray-600 rounded-full">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, isNegative = false }) {
  return (
    <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-white text-xl font-semibold">{value}</div>
        <div className={`text-sm ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
          {trend}
        </div>
      </div>
    </div>
  );
}

function HeatmapView() {
  const [view, setView] = useState('heatmap');
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex justify-between items-center">
        <h2 className="text-gray-400 font-semibold">PLAYER MOVEMENT ANALYSIS</h2>
        <div className="flex">
          <button 
            onClick={() => setView('heatmap')} 
            className={`px-3 py-1 text-sm rounded-l-md ${view === 'heatmap' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Heatmap
          </button>
          <button 
            onClick={() => setView('trajectory')} 
            className={`px-3 py-1 text-sm rounded-r-md ${view === 'trajectory' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Trajectory
          </button>
        </div>
      </div>
      
      <div className="p-4 flex justify-center overflow-auto custom-scrollbar">
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 left-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 right-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          
          {/* Heatmap visualization */}
          {view === 'heatmap' && (
            <>
              <div className="absolute top-1/3 left-1/2 h-32 w-32 bg-red-500 rounded-full opacity-20 blur-lg transform -translate-x-1/2 -translate-y-1/4"></div>
              <div className="absolute top-2/5 left-3/5 h-40 w-40 bg-red-500 rounded-full opacity-30 blur-lg transform -translate-x-1/2 -translate-y-1/4"></div>
              <div className="absolute top-1/2 left-2/3 h-44 w-44 bg-red-500 rounded-full opacity-40 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-3/5 left-3/4 h-36 w-36 bg-red-500 rounded-full opacity-25 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-3/4 h-20 w-20 bg-red-500 rounded-full opacity-15 blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
            </>
          )}
          
          {/* Trajectory visualization */}
          {view === 'trajectory' && (
            <>
              <svg className="absolute inset-0 w-full h-full">
                <path 
                  d="M 200,150 C 250,180 300,160 350,200 S 450,250 500,220 S 550,180 600,210" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
                <circle cx="200" cy="150" r="5" fill="#3b82f6" />
                <circle cx="350" cy="200" r="5" fill="#3b82f6" />
                <circle cx="500" cy="220" r="5" fill="#3b82f6" />
                <circle cx="600" cy="210" r="5" fill="#3b82f6" />
              </svg>
              
              <div className="absolute h-6 w-6 bg-blue-600 rounded-full top-1/4 left-1/3 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
                <span className="text-white text-xs font-bold">10</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-2">ZONE DISTRIBUTION</h3>
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Def</div>
                <div className="text-white font-medium">12%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Mid</div>
                <div className="text-white font-medium">38%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Att</div>
                <div className="text-white font-medium">50%</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-2">FLANK PREFERENCE</h3>
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Left</div>
                <div className="text-white font-medium">35%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Center</div>
                <div className="text-white font-medium">45%</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Right</div>
                <div className="text-white font-medium">20%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionalData() {
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
              <div className="text-white font-medium">68.2m, 42.5m</div>
            </div>
            <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
              <div className="text-gray-400 text-xs">Position Variance</div>
              <div className="text-white font-medium">High (8.3)</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-400 text-sm font-semibold mb-2">OFF-BALL MOVEMENT</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Support Runs</span>
              <span className="text-white">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overlaps</span>
              <span className="text-white">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Half-Space Usage</span>
              <span className="text-white">45%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeedTracker() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">SPEED ANALYSIS</h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-gray-400 text-xs">Top Speed</div>
            <div className="text-white text-xl font-bold">32.1 km/h</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Avg. Speed</div>
            <div className="text-white text-xl font-bold">8.6 km/h</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-gray-400 text-xs font-semibold mb-1">SPEED ZONES</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              layout="vertical"
              data={[
                { name: 'Walking (0-7)', value: 38 },
                { name: 'Jogging (7-14)', value: 42 },
                { name: 'Running (14-21)', value: 25 },
                { name: 'High-Speed (21-25)', value: 15 },
                { name: 'Sprinting (25+)', value: 8 },
              ]}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" tick={{ fontSize: 10 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Bar dataKey="value" fill="#3b82f6" barSize={10} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-gray-400 text-xs font-semibold mb-1">SPRINT ANALYSIS</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-700 bg-opacity-30 p-2 rounded">
              <div className="text-gray-400 text-xs">Total</div>
              <div className="text-white font-medium">23</div>
            </div>
            <div className="bg-gray-700 bg-opacity-30 p-2 rounded">
              <div className="text-gray-400 text-xs">Max Duration</div>
              <div className="text-white font-medium">4.2s</div>
            </div>
            <div className="bg-gray-700 bg-opacity-30 p-2 rounded">
              <div className="text-gray-400 text-xs">Avg. Distance</div>
              <div className="text-white font-medium">18m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistanceCoverage() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">DISTANCE COVERAGE</h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-gray-400 text-xs">Total Distance</div>
            <div className="text-white text-xl font-bold">8.7 km</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">High-Intensity Distance</div>
            <div className="text-white text-xl font-bold">2.4 km</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-gray-400 text-xs font-semibold mb-1">DISTANCE PER 15 MIN</h3>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart
              data={[
                { period: '0-15', distance: 1.8 },
                { period: '15-30', distance: 1.9 },
                { period: '30-45', distance: 1.7 },
                { period: '45-60', distance: 1.4 },
                { period: '60-75', distance: 1.2 },
                { period: '75-90', distance: 0.7 },
              ]}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="period" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Line type="monotone" dataKey="distance" stroke="#06d6a0" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-gray-400 text-xs font-semibold mb-1">COMPARISON</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">vs. Position Average</span>
                <span className="text-green-400">+8%</span>
              </div>
              <div className="h-1 w-full bg-gray-600 rounded-full mt-1">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            {/* Removed "vs. Last Match" as requested */}
          </div>
        </div>
      </div>
    </div>
  );
}

function PassingAnalysis() {
  // Removed "Key Passes" as requested
  const passingStats = [
    { label: 'Passes', value: '27/35' },
    { label: 'Accuracy', value: '77%' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PASSING ANALYSIS</h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          {passingStats.map((stat, index) => (
            <div key={index}>
              <div className="text-gray-400 text-xs">{stat.label}</div>
              <div className="text-white text-lg font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalsScored() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">GOALS ANALYSIS</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center shadow-lg mb-3">
            <span className="text-white text-2xl font-bold">1</span>
          </div>
          <div className="text-white text-lg font-semibold mb-1">GOAL SCORED</div>
        </div>
      </div>
    </div>
  );
}

export default PlayerTrackingPage;