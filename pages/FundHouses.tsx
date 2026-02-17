
import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { apiService } from '../services/apiService';
import { FundHouse } from '../types';

const FundHouses: React.FC = () => {
  const [houses, setHouses] = useState<FundHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [schemesFor, setSchemesFor] = useState<FundHouse | null>(null);
  const [schemes, setSchemes] = useState<Record<string, unknown>[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<{
    id: number;
    name: string;
    amfiId: string;
    fundType: string;
    active: boolean;
  } | null>(null);

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

  const openEdit = (house: FundHouse) => {
    setIsCreating(false);
    setEditForm({
      id: house.id,
      name: house.name,
      amfiId: house.amfiId,
      fundType: house.fundType,
      active: house.active
    });
    setEditOpen(true);
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditForm({
      id: -1,
      name: '',
      amfiId: '',
      fundType: '',
      active: true
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setIsCreating(false);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (!editForm) {
      return;
    }
    setHouses(prev => {
      const exists = prev.some(h => h.id === editForm.id);
      if (exists) {
        return prev.map(h => (h.id === editForm.id ? { ...h, ...editForm } : h));
      }
      const nextId = prev.length > 0 ? Math.max(...prev.map(h => h.id)) + 1 : 1;
      return [
        {
          id: nextId,
          name: editForm.name,
          amfiId: editForm.amfiId,
          fundType: editForm.fundType,
          active: editForm.active,
          camsKraCode: null,
          karvyKraCode: null,
          imageUrl: null
        },
        ...prev
      ];
    });
    closeEdit();
  };

  const loadSchemes = async (house: FundHouse) => {
    setSchemesLoading(true);
    setSchemesFor(house);
    setSchemes([]);
    try {
      const data = await apiService.getSchemesByAmfi(house.amfiId);
      setSchemes(data);
    } catch (error) {
      console.error('Failed to load schemes for AMFI', house.amfiId, error);
      setSchemes([]);
    } finally {
      setSchemesLoading(false);
    }
  };

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
    },
    {
      header: 'Actions',
      accessor: (h: FundHouse) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(h);
            }}
            className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Update
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              loadSchemes(h);
            }}
            className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800"
          >
            {schemesLoading && schemesFor?.id === h.id ? 'Loading...' : 'Load Schemes'}
          </button>
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
        <div className="flex justify-end">
          <button
            onClick={openCreate}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all"
          >
            Add Fund House
          </button>
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

      {editOpen && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{isCreating ? 'Add Fund House' : 'Update Fund House'}</h3>
              <p className="text-xs text-slate-400">
                {isCreating ? 'Enter the details for a new fund house.' : 'Edit name, AMFI code, type, and status.'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fund House Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AMFI Code</label>
                <input
                  value={editForm.amfiId}
                  onChange={(e) => setEditForm({ ...editForm, amfiId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type</label>
                <input
                  value={editForm.fundType}
                  onChange={(e) => setEditForm({ ...editForm, fundType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
                <select
                  value={editForm.active ? 'active' : 'inactive'}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.value === 'active' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundHouses;
