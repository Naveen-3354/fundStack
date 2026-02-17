import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { apiService } from '../services/apiService';
import { SchemeApiItem } from '../types';

const Schemes: React.FC = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<SchemeApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [fundHouseId, setFundHouseId] = useState('');
  const [search, setSearch] = useState('');

  const fetchSchemes = async (p: number, size: number) => {
    setLoading(true);
    try {
      const response = await apiService.getSchemesPage({
        pageNo: p,
        pageSize: size,
        fundHouseId: fundHouseId.trim() || undefined,
        search: search.trim() || undefined
      });
      if (response) {
        setSchemes(response.data);
        setTotal(response.totalCount);
      } else {
        setSchemes([]);
        setTotal(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(page, pageSize);
  }, [page, pageSize]);

  const columns = [
    { 
      header: 'Scheme Name',
      accessor: (s: SchemeApiItem) => (
        <div className="font-semibold text-slate-900">{s.name}</div>
      )
    },
    {
      header: 'AMFI Id',
      accessor: (s: SchemeApiItem) => (
        <span className="font-mono text-indigo-600 font-medium">{s.amfiId}</span>
      )
    },
    {
      header: 'Actions',
      accessor: (s: SchemeApiItem) => (
        <button
          onClick={() => navigate(`/schemes/${s.id}`, { state: s })}
          className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800"
        >
          View
        </button>
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
            onClick={() => fetchSchemes(page, pageSize)}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg"
          >
            Sync Matrix
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Scheme name or AMFI code"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Fund House ID</label>
          <input
            value={fundHouseId}
            onChange={(e) => setFundHouseId(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setPage(1);
            fetchSchemes(1, pageSize);
          }}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {schemes.length === 0 && !loading && (
        <div className="bg-indigo-50 border border-indigo-100 p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">ðŸ“‘</div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Schemes Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
              Try adjusting your filters or verify the API is returning data for the current page.
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
          limit: pageSize,
          onPageChange: (p) => setPage(p)
        }}
      />
    </div>
  );
};

export default Schemes;
