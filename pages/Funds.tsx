
import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/apiService';
import { MutualFund } from '../types';

const Funds: React.FC = () => {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MutualFund>>({ category: 'Equity', active: true });

  const fetchFunds = async (p: number) => {
    setLoading(true);
    try {
      const response = await apiService.getFunds(p, 10);
      setFunds(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch funds", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds(page);
  }, [page]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amcName) return;
    
    await apiService.createFund(formData as Omit<MutualFund, 'id'>);
    setIsModalOpen(false);
    setFormData({ category: 'Equity', active: true });
    fetchFunds(1);
  };

  const columns = [
    { 
      header: 'Fund Name', 
      accessor: (f: MutualFund) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-500">
            {f.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{f.name}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">{f.amcName}</div>
          </div>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' as keyof MutualFund },
    { 
      header: 'AUM', 
      accessor: (f: MutualFund) => `$${(f.aum / 1).toLocaleString()}M`,
      className: 'font-mono'
    },
    { header: 'Founded', accessor: 'foundedDate' as keyof MutualFund },
    { 
      header: 'Status', 
      accessor: (f: MutualFund) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {f.active ? 'Active' : 'Archived'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fund Inventory</h1>
          <p className="text-sm text-slate-400">Master record for all managed mutual funds.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          + Manual Entry
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={funds} 
        loading={loading}
        pagination={{
          total,
          page,
          limit: 10,
          onPageChange: (p) => setPage(p)
        }}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Create New Fund Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form className="p-8 space-y-5" onSubmit={handleSave}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal Fund Name</label>
                <input 
                  required
                  placeholder="e.g. Bluechip Advantage"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AMC Provider</label>
                <input 
                  required
                  placeholder="e.g. HDFC Asset Management"
                  onChange={e => setFormData({...formData, amcName: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                  <select 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                  >
                    <option>Equity</option>
                    <option>Debt</option>
                    <option>Index</option>
                    <option>Liquid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AUM ($ Millions)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    onChange={e => setFormData({...formData, aum: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Create Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funds;
