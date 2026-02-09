
import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/apiService';
import { Scheme, RiskLevel } from '../types';

const Schemes: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSchemes = async (p: number) => {
    setLoading(true);
    try {
      const response = await apiService.getSchemes(p, 10);
      setSchemes(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(page);
  }, [page]);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case RiskLevel.MODERATE: return 'text-amber-600 bg-amber-50 border-amber-100';
      case RiskLevel.HIGH: return 'text-orange-600 bg-orange-50 border-orange-100';
      case RiskLevel.VERY_HIGH: return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const columns = [
    { 
      header: 'Investment Scheme', 
      accessor: (s: Scheme) => (
        <div>
          <div className="font-semibold text-slate-900">{s.name}</div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{s.fundName}</div>
        </div>
      )
    },
    { 
      header: 'Risk Profile', 
      accessor: (s: Scheme) => (
        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getRiskColor(s.riskLevel)}`}>
          {s.riskLevel}
        </span>
      )
    },
    { 
      header: 'NAV', 
      accessor: (s: Scheme) => (
        <span className="font-mono font-bold text-slate-700">₹{s.nav.toFixed(2)}</span>
      )
    },
    { 
      header: 'Expense %', 
      accessor: (s: Scheme) => (
        <span className="text-slate-500 font-medium">{s.expenseRatio}%</span>
      )
    },
    { 
      header: '1Y Performance', 
      accessor: (s: Scheme) => (
        <span className={`font-bold ${s.returns1Y >= 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
          {s.returns1Y > 0 ? '+' : ''}{s.returns1Y}%
        </span>
      )
    },
    { 
      header: '3Y Aggregate', 
      accessor: (s: Scheme) => (
        <span className={`font-bold ${s.returns3Y >= 15 ? 'text-indigo-600' : 'text-slate-400'}`}>
          {s.returns3Y > 0 ? '+' : ''}{s.returns3Y}%
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scheme Matrix</h1>
          <p className="text-sm text-slate-400">Granular performance data for all fund variants.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">Export Data</button>
           <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg"
          >
             Sync Matrix
           </button>
        </div>
      </div>

      {schemes.length === 0 && !loading && (
        <div className="bg-indigo-50 border border-indigo-100 p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">📑</div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Schemes Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
              Start by creating a fund in the <b>Mutual Funds</b> tab, then use the <b>Instruction Console</b> in the sidebar to add schemes one by one.
            </p>
          </div>
        </div>
      )}

      <DataTable 
        columns={columns} 
        data={schemes} 
        loading={loading}
        pagination={{
          total,
          page,
          limit: 10,
          onPageChange: (p) => setPage(p)
        }}
      />
    </div>
  );
};

export default Schemes;
