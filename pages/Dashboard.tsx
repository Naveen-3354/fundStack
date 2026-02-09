
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Mutual Funds', value: '42', delta: '+2 this month', icon: '🏢', color: 'bg-blue-500' },
    { label: 'Active Schemes', value: '1,284', delta: '+12.5%', icon: '📜', color: 'bg-emerald-500' },
    { label: 'Total AUM (Global)', value: '$14.2B', delta: '+4.2%', icon: '💰', color: 'bg-indigo-500' },
    { label: 'Pending Updates', value: '18', delta: 'Requires action', icon: '⚠️', color: 'bg-amber-500' },
  ];

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl shadow-inner text-white`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.delta.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.delta}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">New Funds Inflow (Last 6 Months)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium">
              <option>Year 2024</option>
              <option>Year 2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">System Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Database Load</span>
                <span className="text-sm font-bold text-slate-900">24%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{width: '24%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">API Latency</span>
                <span className="text-sm font-bold text-slate-900">42ms</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '15%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Storage Capacity</span>
                <span className="text-sm font-bold text-slate-900">68%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{width: '68%'}}></div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 rounded-lg bg-indigo-50 border border-indigo-100">
             <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
               <span>💡</span> Pro Tip
             </h4>
             <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
               Use the Data Loader module to batch-update mutual fund categories for Q3 alignment.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
