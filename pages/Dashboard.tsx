
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState({ funds: 0, schemes: 0, houses: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const f = await apiService.getFunds();
      const s = await apiService.getSchemes();
      const h = await apiService.getFundHouses();
      setCounts({ funds: f.total, schemes: s.total, houses: h.length });
    };
    loadStats();
  }, []);

  const handleReset = async () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      await apiService.clearAllData();
      window.location.reload();
    }
  };

  const stats = [
    { label: 'Registered Funds', value: counts.funds, icon: '🏢', color: 'bg-blue-500' },
    { label: 'Active Schemes', value: counts.schemes, icon: '📜', color: 'bg-emerald-500' },
    { label: 'Fund Houses', value: counts.houses, icon: '🏠', color: 'bg-indigo-500' },
    { label: 'System Status', value: 'Live', icon: '🛡️', color: 'bg-amber-500' },
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
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Instructional Guide</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">1</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use the <b>Fund Houses</b> tab to see data coming from your local API (<code>:8080/fund-house</code>).
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">2</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manually add Mutual Funds using the <b>+ Manual Entry</b> button in the Mutual Funds tab.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">3</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use the <b>AI Console</b> in the sidebar to add records using natural language.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 p-8 rounded-xl border border-rose-100 shadow-sm">
          <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
            <span>⚠️</span> Danger Zone
          </h3>
          <p className="text-sm text-rose-700 mb-6">
            Resetting the system will permanently delete all created fund and scheme records from your local storage.
          </p>
          <button 
            onClick={handleReset}
            className="w-full py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
          >
            Reset All System Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
