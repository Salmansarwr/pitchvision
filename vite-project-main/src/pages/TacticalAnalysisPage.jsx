// src/pages/TacticalAnalysisPage.jsx
import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';

function TacticalAnalysisPage() {
  return (
    <Layout title="Tactical Analysis">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TeamStats />
        <DistanceComparison />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <SpeedAnalysis />
        <TopPerformers />
      </div>
    </Layout>
  );
}

function TeamStats() {
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
              data={[{ name: 'Ball Possession', teamA: 63, teamB: 37 }]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" domain={[0, 100]} stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
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
                { name: 'Total Passes', teamA: 587, teamB: 342 },
                { name: 'Completed', teamA: 511, teamB: 281 },
                { name: 'Key Passes', teamA: 14, teamB: 8 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Bar dataKey="teamA" name="Team A" fill="#3b82f6" />
              <Bar dataKey="teamB" name="Team B" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Pass Success Rate</span>
              <span className="text-white">87% | 82%</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '51%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '49%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Progressive Passes</span>
              <span className="text-white">102 | 78</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '57%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '43%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Passes Into Final Third</span>
              <span className="text-white">85 | 54</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '61%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '39%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistanceComparison() {
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
          <h3 className="text-gray-400 text-sm font-semibold mb-2">TOTAL TEAM DISTANCE (KM)</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart
              layout="vertical"
              data={[{ name: 'Distance (km)', teamA: 112.4, teamB: 108.7 }]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Bar dataKey="teamA" name="Team A" fill="#3b82f6" />
              <Bar dataKey="teamB" name="Team B" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">DISTANCE BY PERIOD (KM)</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart
              data={[
                { period: '0-15', teamA: 19.3, teamB: 18.8 },
                { period: '15-30', teamA: 18.9, teamB: 18.4 },
                { period: '30-45', teamA: 18.2, teamB: 17.9 },
                { period: '45-60', teamA: 19.5, teamB: 18.7 },
                { period: '60-75', teamA: 18.7, teamB: 17.8 },
                { period: '75-90', teamA: 17.8, teamB: 17.1 },
              ]}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="period" stroke="#666" />
              <YAxis stroke="#666" domain={[16, 20]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
              <Legend />
              <Line type="monotone" dataKey="teamA" name="Team A" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="teamB" name="Team B" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Distance in Possession (km)</span>
              <span className="text-white">67.4 | 32.6</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '67%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '33%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Distance Without Ball (km)</span>
              <span className="text-white">45.0 | 76.1</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '37%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '63%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeedAnalysis() {
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
            <div className="text-white text-2xl font-bold mt-2">7.2 km/h</div>
            <div className="text-blue-400 text-sm">Team A</div>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Average Team Speed</div>
            <div className="text-white text-2xl font-bold mt-2">6.9 km/h</div>
            <div className="text-pink-400 text-sm">Team B</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Max Speed Recorded</div>
            <div className="text-white text-2xl font-bold mt-2">34.8 km/h</div>
            <div className="text-blue-400 text-sm">Team A (Torres)</div>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
            <div className="text-gray-400 text-sm">Max Speed Recorded</div>
            <div className="text-white text-2xl font-bold mt-2">33.2 km/h</div>
            <div className="text-pink-400 text-sm">Team B (Davies)</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">SPRINT ANALYSIS</h3>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Sprints</span>
              <span className="text-white">183 | 164</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '53%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '47%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Sprint Distance (km)</span>
              <span className="text-white">6.8 | 6.2</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '52%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '48%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">High-Intensity Runs</span>
              <span className="text-white">248 | 236</span>
            </div>
            <div className="h-1 w-full bg-gray-600 rounded-full mt-1 flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '51%' }}></div>
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '49%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopPerformers() {
  const [category, setCategory] = useState('distance');
  
  const distanceData = [
    { player: 'A. Henderson', team: 'Team A', value: '12.7 km', jersey: '8' },
    { player: 'B. Rodriguez', team: 'Team B', value: '12.5 km', jersey: '6' },
    { player: 'J. Williams', team: 'Team A', value: '12.3 km', jersey: '10' },
    { player: 'P. Davies', team: 'Team B', value: '12.1 km', jersey: '8' },
    { player: 'S. Torres', team: 'Team A', value: '11.9 km', jersey: '7' },
  ];
  
  const speedData = [
    { player: 'S. Torres', team: 'Team A', value: '34.8 km/h', jersey: '7' },
    { player: 'P. Davies', team: 'Team B', value: '33.2 km/h', jersey: '8' },
    { player: 'T. Walters', team: 'Team A', value: '32.7 km/h', jersey: '11' },
    { player: 'M. Johnson', team: 'Team B', value: '32.3 km/h', jersey: '10' },
    { player: 'K. Lewis', team: 'Team A', value: '31.9 km/h', jersey: '3' },
  ];
  
  const sprintsData = [
    { player: 'T. Walters', team: 'Team A', value: '28', jersey: '11' },
    { player: 'M. Johnson', team: 'Team B', value: '26', jersey: '10' },
    { player: 'S. Torres', team: 'Team A', value: '24', jersey: '7' },
    { player: 'P. Davies', team: 'Team B', value: '22', jersey: '8' },
    { player: 'R. Martinez', team: 'Team A', value: '21', jersey: '9' },
  ];
  
  const currentData = category === 'distance' ? distanceData : 
                      category === 'speed' ? speedData : 
                      sprintsData;
  
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
                  <span className="text-white">Team A: 10.2 km per player</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-white">Team B: 9.9 km per player</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {category === 'speed' && (
          <div className="mt-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <div className="text-gray-400 text-sm font-semibold mb-2">HIGH SPEED RUNS (20+ KM/H)</div>
            <div className="flex justify-between">
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-white">Team A: 152 runs</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-white">Team B: 143 runs</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {category === 'sprints' && (
          <div className="mt-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <div className="text-gray-400 text-sm font-semibold mb-2">SPRINT EFFICIENCY</div>
            <div className="flex justify-between">
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-white">Team A: 6 goal attempts from sprints</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-white">Team B: 4 goal attempts from sprints</span>
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