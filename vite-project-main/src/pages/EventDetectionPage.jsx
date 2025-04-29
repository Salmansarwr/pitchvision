// src/pages/EventDetectionPage.jsx
import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/shared/Layout';

function EventDetectionPage() {
  return (
    <Layout title="Event Detection">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <EventsSummary />
        <div className="md:col-span-2">
          <EventVideoClips />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <EventDistribution />
        <EventFilters />
        <GoalAndPassingEvents />
      </div>
    </Layout>
  );
}

function EventsSummary() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">EVENT SUMMARY</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <EventStatCard type="Goals" teamA="2" teamB="1" />
          <EventStatCard type="Shots" teamA="12" teamB="8" />
        </div>
        <EventStatCard type="Passes" teamA="245" teamB="198" />
        
        <div className="mt-6">
          <h3 className="text-gray-400 text-sm font-semibold mb-3">EVENT TIMELINE</h3>
          <div className="relative h-6 bg-gray-700 rounded-full w-full overflow-hidden">
            <div className="absolute h-full w-1 bg-blue-500" style={{ left: '5%' }}></div>
            <div className="absolute h-full w-1 bg-pink-500" style={{ left: '18%' }}></div>
            <div className="absolute h-full w-1 bg-blue-500" style={{ left: '62%' }}></div>
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

function EventDistribution() {
  const data = [
    { name: 'Shots', value: 20 },
    { name: 'Passes', value: 443 },
    { name: 'Goals', value: 3 },
  ];
  
  const COLORS = ['#3b82f6', '#e11d48', '#22c55e'];
  
  // Custom label renderer to ensure label visibility
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    // Position the label further from the pie to ensure visibility
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
                outerRadius={65}  // Slightly smaller radius to leave room for labels
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
                labelStyle={{ color: 'white' }}  // Ensure tooltip title is white
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

function EventVideoClips() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">EVENT CLIPS</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoClip time="62" type="Goal" team="Team A" player="#9" />
          <VideoClip time="18" type="Goal" team="Team B" player="#11" />
          <VideoClip time="5" type="Goal" team="Team A" player="#10" />
          <VideoClip time="38" type="Shot" team="Team A" player="#10" />
        </div>
      </div>
    </div>
  );
}

function VideoClip({ time, type, team, player }) {
  const teamColor = team === "Team A" ? "bg-blue-600" : "bg-pink-600";
  
  return (
    <div className="bg-gray-700 bg-opacity-30 rounded-lg p-3">
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
      <div className="bg-gray-900 h-24 rounded-md flex items-center justify-center">
        <span className="text-gray-500">Video thumbnail</span>
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

function GoalAndPassingEvents() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
        <h2 className="text-gray-400 font-semibold">GOALS & PASSES</h2>
      </div>
      <div className="p-4">
        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg mb-3">
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-white font-medium">Team A Goals: 2</span>
          </div>
          <div className="text-sm text-gray-400">
            5' - Player #10 • 62' - Player #9
          </div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg mb-5">
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-white font-medium">Team B Goals: 1</span>
          </div>
          <div className="text-sm text-gray-400">
            18' - Player #11
          </div>
        </div>
        
        <h3 className="text-gray-400 text-sm font-semibold mb-3">PASS TYPES</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Short', teamA: 156, teamB: 125 },
                { name: 'Medium', teamA: 68, teamB: 53 },
                { name: 'Long', teamA: 21, teamB: 20 },
              ]}
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