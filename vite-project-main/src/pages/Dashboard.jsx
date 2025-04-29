// src/pages/Dashboard.jsx
import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';

function Dashboard() {
  return (
    <Layout title="Dashboard">
      <MatchTrackingHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <PassingStats />
        <PossessionStats />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        <div className="lg:col-span-3">
          <PitchView />
        </div>
        <div className="lg:col-span-1">
          <PlayerStats />
        </div>
      </div>
    </Layout>
  );
}

// Match Tracking Header Component
const MatchTrackingHeader = () => {
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Here you would typically process the file or send it to the server
      console.log("File uploaded:", file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
      <div className="flex items-center">
        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="ml-2 text-white font-bold">MATCH TRACKING</span>
      </div>
      <div className="mx-6 h-10 border-l border-gray-600"></div>
      <div className="text-white overflow-x-auto custom-scrollbar">
        {fileName ? fileName : "Upload The Match Video"}
      </div>
      <div className="ml-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          className="hidden"
        />
        <button 
          onClick={triggerFileInput}
          className="px-4 py-2 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition"
        >
          Select Match
        </button>
      </div>
    </div>
  );
};

// Passing Stats Component
function PassingStats() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PASSING STATISTICS</h2>
      </div>
      <div className="p-4 flex flex-col items-center overflow-y-auto max-h-72 custom-scrollbar">
        <div className="flex items-center justify-between w-full my-4">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              FCB
            </div>
            <span className="mt-2 text-gray-400">Team A</span>
          </div>
          
          <div className="text-white text-2xl font-bold">
            PASSES
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
              RMD
            </div>
            <span className="mt-2 text-gray-400">Team B</span>
          </div>
        </div>
        
        <div className="mt-4 w-full">
          <div className="flex justify-between mb-1">
            <span className="text-blue-400 font-medium">542</span>
            <span className="text-gray-400 text-sm">Total Passes</span>
            <span className="text-pink-400 font-medium">318</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full flex">
            <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '63%' }}></div>
            <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '37%' }}></div>
          </div>
        </div>
        
        <div className="mt-4 w-full">
          <div className="flex justify-between mb-1">
            <span className="text-blue-400 font-medium">87%</span>
            <span className="text-gray-400 text-sm">Pass Accuracy</span>
            <span className="text-pink-400 font-medium">82%</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full flex">
            <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '51%' }}></div>
            <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '49%' }}></div>
          </div>
        </div>
        
        <div className="mt-6 w-full grid grid-cols-2 gap-4">
          <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <h3 className="text-gray-400 text-xs mb-2 text-center">PASS TYPES - TEAM A</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Short</span>
                <span className="text-white">324 (92%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Medium</span>
                <span className="text-white">158 (84%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Long</span>
                <span className="text-white">60 (78%)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <h3 className="text-gray-400 text-xs mb-2 text-center">PASS TYPES - TEAM B</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Short</span>
                <span className="text-white">175 (89%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Medium</span>
                <span className="text-white">94 (80%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Long</span>
                <span className="text-white">49 (71%)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 w-full">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Key Passes</span>
            <span className="text-white">14 - 9</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">Forward Passes</span>
            <span className="text-white">243 - 156</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">Passes to Final Third</span>
            <span className="text-white">78 - 43</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Possession Stats Component
function PossessionStats() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">BALL POSSESSION</h2>
      </div>
      <div className="p-4 overflow-y-auto max-h-72 custom-scrollbar">
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: '63%' }}></div>
        </div>
        
        <div className="flex justify-between mt-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-gray-400">Team A</span>
            <span className="ml-2 text-white font-semibold">63%</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-gray-400">Team B</span>
            <span className="ml-2 text-white font-semibold">37%</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">POSSESSION TREND</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart
              data={[
                { minute: '0-15', teamA: 50, teamB: 50 },
                { minute: '15-30', teamA: 55, teamB: 45 },
                { minute: '30-45', teamA: 60, teamB: 40 },
                { minute: '45-60', teamA: 58, teamB: 42 },
                { minute: '60-75', teamA: 63, teamB: 37 },
              ]}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="minute" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
              />
              <Line type="monotone" dataKey="teamA" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="teamB" stroke="#ec4899" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">ZONES OF POSSESSION</h3>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Defensive</span>
            <span>Middle</span>
            <span>Attacking</span>
          </div>
          <div className="flex h-6 w-full rounded-md overflow-hidden">
            <div className="bg-blue-800 w-2/12 flex items-center justify-center text-xs text-white">20%</div>
            <div className="bg-blue-600 w-5/12 flex items-center justify-center text-xs text-white">50%</div>
            <div className="bg-blue-400 w-3/12 flex items-center justify-center text-xs text-white">30%</div>
          </div>
          <div className="flex h-6 w-full rounded-md overflow-hidden mt-1">
            <div className="bg-pink-800 w-3/12 flex items-center justify-center text-xs text-white">30%</div>
            <div className="bg-pink-600 w-6/12 flex items-center justify-center text-xs text-white">60%</div>
            <div className="bg-pink-400 w-1/12 flex items-center justify-center text-xs text-white">10%</div>
          </div>
          <div className="flex justify-between mt-1">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-600 mr-1"></div>
              <span className="text-gray-400 text-xs">Team A</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-pink-600 mr-1"></div>
              <span className="text-gray-400 text-xs">Team B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pitch View Component
function PitchView() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50 flex justify-between items-center">
        <h2 className="text-gray-400 font-semibold">LIVE TRACKING VIEW</h2>
        <div className="flex space-x-2">
          <button className="p-1 bg-gray-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-1 bg-gray-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-center overflow-auto custom-scrollbar">
        <div className="relative w-full aspect-[16/9] max-w-4xl bg-gradient-to-r from-green-900 to-green-800 rounded-lg overflow-hidden mx-auto">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white border-opacity-30 m-2 rounded"></div>
          
          {/* Center line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white bg-opacity-30"></div>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white border-opacity-30"></div>
          
          {/* Penalty areas */}
          <div className="absolute top-1/4 left-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          <div className="absolute top-1/4 right-0 h-1/2 w-1/6 border border-white border-opacity-30"></div>
          
          {/* Goal areas */}
          <div className="absolute top-1/3 left-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          <div className="absolute top-1/3 right-0 h-1/3 w-1/12 border border-white border-opacity-30"></div>
          
          {/* Goals */}
          <div className="absolute top-2/5 left-0 h-1/5 w-1 bg-white"></div>
          <div className="absolute top-2/5 right-0 h-1/5 w-1 bg-white"></div>
          
          {/* Players - Team A */}
          <PlayerDot top="50%" left="12%" jersey="1" teamColor="blue" />
          <PlayerDot top="30%" left="25%" jersey="2" teamColor="blue" />
          <PlayerDot top="50%" left="25%" jersey="4" teamColor="blue" />
          <PlayerDot top="70%" left="25%" jersey="5" teamColor="blue" />
          <PlayerDot top="40%" left="40%" jersey="6" teamColor="blue" />
          <PlayerDot top="60%" left="40%" jersey="8" teamColor="blue" />
          <PlayerDot top="30%" left="60%" jersey="7" teamColor="blue" />
          <PlayerDot top="70%" left="60%" jersey="11" teamColor="blue" />
          <PlayerDot top="50%" left="75%" jersey="10" teamColor="blue" />
          
          {/* Players - Team B */}
          <PlayerDot top="50%" left="88%" jersey="1" teamColor="pink" />
          <PlayerDot top="30%" left="75%" jersey="2" teamColor="pink" />
          <PlayerDot top="50%" left="75%" jersey="5" teamColor="pink" />
          <PlayerDot top="70%" left="75%" jersey="3" teamColor="pink" />
          <PlayerDot top="25%" left="60%" jersey="7" teamColor="pink" />
          <PlayerDot top="75%" left="60%" jersey="8" teamColor="pink" />
          <PlayerDot top="40%" left="45%" jersey="6" teamColor="pink" />
          <PlayerDot top="60%" left="45%" jersey="10" teamColor="pink" />
          <PlayerDot top="50%" left="35%" jersey="9" teamColor="pink" />
          
          {/* Ball */}
          <div className="absolute h-3 w-3 bg-white rounded-full top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="flex overflow-x-auto custom-scrollbar">
          <button className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm mr-2 whitespace-nowrap">Live View</button>
          <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded-md text-sm mr-2 whitespace-nowrap">Heatmap</button>
          <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded-md text-sm mr-2 whitespace-nowrap">Passing Network</button>
          <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded-md text-sm mr-2 whitespace-nowrap">Player Paths</button>
        </div>
      </div>
    </div>
  );
}

// Player Dot Component
function PlayerDot({ top, left, jersey, teamColor }) {
  const bgColor = teamColor === 'blue' ? 'bg-blue-600' : 'bg-pink-600';
  
  return (
    <div className={`absolute ${bgColor} h-6 w-6 rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2`} style={{ top, left }}>
      <span className="text-white text-xs font-bold">{jersey}</span>
    </div>
  );
}

// Player Stats Component
function PlayerStats() {
  const [selectedPlayer, setSelectedPlayer] = useState('Player #10 (Team A)');
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">PLAYER STATS</h2>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <select 
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md mb-4 custom-scrollbar"
          value={selectedPlayer}
          onChange={e => setSelectedPlayer(e.target.value)}
        >
          <option>Player #10 (Team A)</option>
          <option>Player #7 (Team A)</option>
          <option>Player #5 (Team B)</option>
          <option>Player #9 (Team A)</option>
          <option>Player #11 (Team B)</option>
          <option>Player #4 (Team A)</option>
          <option>Player #8 (Team B)</option>
        </select>
        
        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-grow">
          <StatItem label="Distance Covered" value="8.7 km" />
          <StatItem label="Top Speed" value="32.1 km/h" />
          <StatItem label="Possession Lost" value="4" />
          <StatItem label="Shots" value="3 (2 on target)" />
          <StatItem label="Pass Accuracy" value="77%" />
          <StatItem label="Key Passes" value="4" />
          <StatItem label="Progressive Passes" value="12" />
        </div>
        
        <div className="mt-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">HEAT MAP</h3>
          <div className="h-24 bg-green-900 rounded-md overflow-hidden relative">
            <div className="absolute top-1/4 left-1/4 h-12 w-12 bg-blue-500 rounded-full opacity-40 blur-md"></div>
            <div className="absolute top-1/2 left-1/2 h-16 w-16 bg-blue-500 rounded-full opacity-60 blur-md"></div>
            <div className="absolute bottom-1/4 right-1/3 h-10 w-10 bg-blue-500 rounded-full opacity-30 blur-md"></div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">SPEED CHART (km/h)</h3>
          <ResponsiveContainer width="100%" height={80} className="custom-scrollbar">
            <BarChart
              data={[
                { minute: '0-15', speed: 22 },
                { minute: '15-30', speed: 28 },
                { minute: '30-45', speed: 25 },
                { minute: '45-60', speed: 32 },
                { minute: '60-75', speed: 29 },
              ]}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="minute" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
              />
              <Bar dataKey="speed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Stat Item Component
function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

export default Dashboard;