// src/pages/MatchReportsPage.jsx
import React from 'react';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';

function MatchReportsPage() {
  return (
    <Layout title="Match Reports">
      <PageHeader />
      <div className="mt-4">
        <MatchSummary />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TeamStatistics />
        <PlayerStatistics />
      </div>
      <div className="mt-4">
        <PassEvents />
      </div>
    </Layout>
  );
}

// Page-specific components
function PageHeader() {
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
        <button className="px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition">
          Export PDF
        </button>
      </div>
    </div>
  );
}

function MatchSummary() {
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
              2 - 1
            </div>
            <div className="text-cyan-400 text-sm mt-1">
              Match ID: 10283 • Mar 10, 2025
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
            <div className="text-white font-medium">63% - 37%</div>
          </div>
          <div className="bg-gray-700 bg-opacity-30 p-2 rounded text-center">
            <div className="text-gray-400 text-xs">Goals</div>
            <div className="text-white font-medium">2 - 1</div>
          </div>
          <div className="bg-gray-700 bg-opacity-30 p-2 rounded text-center">
            <div className="text-gray-400 text-xs">Passes</div>
            <div className="text-white font-medium">542 - 318</div>
          </div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg mb-4">
          <h3 className="text-white text-sm font-medium mb-2">Goal Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Team A (Frame 305)</span>
              <span className="text-white">Player ID: P-1042</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Team B (Frame 1080)</span>
              <span className="text-white">Player ID: P-2016</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Team A (Frame 3720)</span>
              <span className="text-white">Player ID: P-1039</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamStatistics() {
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
            team1Value={63} 
            team2Value={37} 
            maxValue={100} 
          />
          <StatComparisonBar 
            label="Passes" 
            team1Value={542} 
            team2Value={318} 
            maxValue={600} 
          />
          <StatComparisonBar 
            label="Goals" 
            team1Value={2} 
            team2Value={1} 
            maxValue={5} 
          />
        </div>
        
        <div className="mt-6">
          <h3 className="text-white text-sm font-medium mb-3">Possession Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={[
                { frame: 900, teamA: 68, teamB: 32 },
                { frame: 1800, teamA: 65, teamB: 35 },
                { frame: 2700, teamA: 63, teamB: 37 },
                { frame: 3600, teamA: 60, teamB: 40 },
                { frame: 4500, teamA: 62, teamB: 38 },
                { frame: 5400, teamA: 63, teamB: 37 },
              ]}
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
        
        <div className="mt-6">
          <h3 className="text-white text-sm font-medium mb-3">Ball Control Heatmap</h3>
          <div className="bg-gray-700 bg-opacity-50 h-48 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <p>Field Control Visualization</p>
              <p className="text-sm mt-1">(Shows areas of field where each team had most possession)</p>
            </div>
          </div>
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

function PlayerStatistics() {
  const playerData = [
    { id: 'P-1042', team: 'A', distance: 11.2, maxSpeed: 32.5, avgSpeed: 8.7 },
    { id: 'P-1039', team: 'A', distance: 10.8, maxSpeed: 30.1, avgSpeed: 8.2 },
    { id: 'P-1056', team: 'A', distance: 9.7, maxSpeed: 28.7, avgSpeed: 7.9 },
    { id: 'P-2016', team: 'B', distance: 10.3, maxSpeed: 33.8, avgSpeed: 8.5 },
    { id: 'P-2023', team: 'B', distance: 9.6, maxSpeed: 29.2, avgSpeed: 7.8 },
  ];
  
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
              {playerData.map(player => (
                <tr key={player.id} className="text-white">
                  <td className="px-4 py-3 text-left">{player.id}</td>
                  <td className="px-4 py-3 text-center">
                    <div className={`mx-auto h-6 w-6 rounded-full ${player.team === 'A' ? 'bg-blue-600' : 'bg-pink-600'} flex items-center justify-center text-white text-xs`}>
                      {player.team}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{player.distance}</td>
                  <td className="px-4 py-3 text-center">{player.maxSpeed}</td>
                  <td className="px-4 py-3 text-center">{player.avgSpeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <h3 className="text-white text-sm font-medium mb-3">Player Tracking Visualization</h3>
          <div className="bg-gray-700 bg-opacity-50 h-48 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <p>Movement Patterns Visualization</p>
              <p className="text-sm mt-1">(Shows player movement paths and intensity)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassEvents() {
  const passData = [
    { id: 1, frame: 183, fromPlayer: 'P-1042', toPlayer: 'P-1039', team: 'A' },
    { id: 2, frame: 245, fromPlayer: 'P-1039', toPlayer: 'P-1056', team: 'A' },
    { id: 3, frame: 310, fromPlayer: 'P-2016', toPlayer: 'P-2023', team: 'B' },
    { id: 4, frame: 378, fromPlayer: 'P-1056', toPlayer: 'P-1042', team: 'A' },
    { id: 5, frame: 421, fromPlayer: 'P-2023', toPlayer: 'P-2016', team: 'B' },
    { id: 6, frame: 492, fromPlayer: 'P-1042', toPlayer: 'P-1056', team: 'A' },
    { id: 7, frame: 537, fromPlayer: 'P-2016', toPlayer: 'P-2023', team: 'B' },
  ];
  
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
              {passData.map(pass => (
                <tr key={pass.id} className="text-white">
                  <td className="px-4 py-3 text-left">{pass.frame}</td>
                  <td className="px-4 py-3 text-left">{pass.fromPlayer}</td>
                  <td className="px-4 py-3 text-left">{pass.toPlayer}</td>
                  <td className="px-4 py-3 text-center">
                    <div className={`mx-auto h-6 w-6 rounded-full ${pass.team === 'A' ? 'bg-blue-600' : 'bg-pink-600'} flex items-center justify-center text-white text-xs`}>
                      {pass.team}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MatchReportsPage;