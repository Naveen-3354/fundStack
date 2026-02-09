
import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/apiService';
import { FundHouse } from '../types';

const FundHouses: React.FC = () => {
  const [houses, setHouses] = useState<FundHouse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const data = await apiService.getFundHouses();
      setHouses(data);
    } catch (error) {
      console.error("Failed to fetch fund houses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const columns = [
    { 
      header: 'Fund House Name', 
      accessor: (h: FundHouse) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {h.imageUrl ? (
              <img src={h.imageUrl} alt={h.name} className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-slate-400 font-bold text-lg">{h.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{h.name}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ID: #{h.id}</div>
          </div>
        </div>
      )
    },
    { 
        header: 'AMFI ID', 
        accessor: 'amfiId' as keyof FundHouse,
        className: 'font-mono text-indigo-600 font-medium'
    },
    { 
        header: 'Type', 
        accessor: 'fundType' as keyof FundHouse,
        className: 'font-bold text-slate-500'
    },
    { 
      header: 'Status', 
      accessor: (h: FundHouse) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${h.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {h.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'KRA Codes',
      accessor: (h: FundHouse) => (
        <div className="text-[10px] space-y-0.5">
          <div><span className="text-slate-400">CAMS:</span> {h.camsKraCode || 'N/A'}</div>
          <div><span className="text-slate-400">KARVY:</span> {h.karvyKraCode || 'N/A'}</div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fund Houses</h1>
          <p className="text-sm text-slate-400">Manage registered Asset Management Companies (AMCs) and their identifiers.</p>
        </div>
        <button 
          onClick={fetchHouses}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh List
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={houses} 
        loading={loading}
      />
      
      {houses.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-5xl mb-4">🏚️</div>
          <h3 className="text-lg font-bold text-slate-900">No Fund Houses Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            The local API at <code>http://localhost:8080/fund-house</code> returned an empty list or could not be reached.
          </p>
        </div>
      )}
    </div>
  );
};

export default FundHouses;
