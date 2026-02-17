import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { SchemeApiItem, SchemeOverview } from '../types';

const formatDate = (iso?: string) => {
  if (!iso) {
    return 'N/A';
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
};

const SchemeDetail: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const scheme = (location.state as SchemeApiItem | undefined) ?? null;
  const [overview, setOverview] = useState<SchemeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<SchemeOverview | null>(null);

  const schemeId = useMemo(() => id ?? '', [id]);

  const fetchOverview = async () => {
    if (!schemeId) {
      setOverview(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.getSchemeOverview(schemeId);
      setOverview(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [schemeId]);

  const openEdit = () => {
    setEditForm(
      overview ?? {
        id: schemeId ? Number(schemeId) : -1,
        mfName: scheme?.amfiId ? scheme.amfiId : '',
        schemeName: scheme?.name ?? '',
        schemeTypeDesc: '',
        schemeCatDesc: '',
        schemeObjective: '',
        schemeLoad: '',
        schemeMinAmt: '',
        launchDate: '',
        amcWebsite: ''
      }
    );
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (!editForm) {
      return;
    }
    setOverview(editForm);
    closeEdit();
  };

  const syncOverview = async () => {
    if (!schemeId) {
      return;
    }
    setSyncing(true);
    const data = await apiService.getSchemeOverview(schemeId);
    setOverview(data);
    setSyncing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 rounded-2xl shadow-lg text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Scheme Overview</div>
            <h1 className="text-2xl font-semibold">{scheme?.name ?? 'Scheme Detail'}</h1>
            <p className="text-sm text-slate-300">ID: {schemeId || 'Unknown'}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/schemes"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors"
            >
              Back
            </Link>
            <button
              onClick={openEdit}
              className="px-4 py-2 bg-emerald-500 rounded-lg text-xs font-bold uppercase tracking-widest text-white hover:bg-emerald-400 transition-colors"
            >
              Edit Overview
            </button>
          </div>
        </div>
        {scheme?.amfiId && (
          <div className="text-xs text-slate-300">
            AMFI Code: <span className="font-mono text-white">{scheme.amfiId}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-400">
          Loading scheme overview...
        </div>
      ) : overview ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scheme Name</div>
              <div className="text-xl font-semibold text-slate-900">{overview.schemeName}</div>
              <div className="text-sm text-slate-500 mt-1">{overview.schemeCatDesc}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Objective</div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{overview.schemeObjective || 'N/A'}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loads</div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{overview.schemeLoad || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mutual Fund</div>
                <div className="text-sm font-semibold text-slate-900">{overview.mfName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</div>
                <div className="text-sm text-slate-700">{overview.schemeTypeDesc || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Minimum Amount</div>
                <div className="text-sm text-slate-700">{overview.schemeMinAmt || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Launch Date</div>
                <div className="text-sm text-slate-700">{formatDate(overview.launchDate)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">AMC Website</div>
                {overview.amcWebsite ? (
                  <a
                    href={overview.amcWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-500 break-all"
                  >
                    {overview.amcWebsite}
                  </a>
                ) : (
                  <div className="text-sm text-slate-700">N/A</div>
                )}
              </div>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Overview Actions</div>
              <button
                onClick={syncOverview}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
              >
                {syncing ? 'Syncing...' : 'Sync Overview'}
              </button>
              <button
                onClick={openEdit}
                className="w-full px-4 py-2 bg-emerald-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors"
              >
                Edit Overview
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="text-lg font-semibold text-slate-900">No Overview Available</div>
          <div className="text-sm text-slate-500">
            The overview endpoint returned no data for this scheme. Sync or add it manually.
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={syncOverview}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              {syncing ? 'Syncing...' : 'Sync Overview'}
            </button>
            <button
              onClick={openEdit}
              className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Add Manually
            </button>
          </div>
        </div>
      )}

      {editOpen && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full sm:max-w-xl md:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Scheme Overview</h3>
              <p className="text-xs text-slate-400">Update the overview fields below.</p>
            </div>

            {/* Scrollable content */}
            <div className="p-6 grid gap-4 md:grid-cols-2 overflow-y-auto flex-1">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Scheme Name</label>
                <input
                  value={editForm.schemeName}
                  onChange={(e) => setEditForm({ ...editForm, schemeName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mutual Fund</label>
                <input
                  value={editForm.mfName}
                  onChange={(e) => setEditForm({ ...editForm, mfName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Scheme Type</label>
                <input
                  value={editForm.schemeTypeDesc}
                  onChange={(e) => setEditForm({ ...editForm, schemeTypeDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category Description</label>
                <input
                  value={editForm.schemeCatDesc}
                  onChange={(e) => setEditForm({ ...editForm, schemeCatDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Objective</label>
                <textarea
                  value={editForm.schemeObjective}
                  onChange={(e) => setEditForm({ ...editForm, schemeObjective: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Load Details</label>
                <textarea
                  value={editForm.schemeLoad}
                  onChange={(e) => setEditForm({ ...editForm, schemeLoad: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Minimum Amount</label>
                <input
                  value={editForm.schemeMinAmt}
                  onChange={(e) => setEditForm({ ...editForm, schemeMinAmt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Launch Date</label>
                <input
                  value={editForm.launchDate}
                  onChange={(e) => setEditForm({ ...editForm, launchDate: e.target.value })}
                  placeholder="2023-09-03T18:30:00Z"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AMC Website</label>
                <input
                  value={editForm.amcWebsite}
                  onChange={(e) => setEditForm({ ...editForm, amcWebsite: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 flex-shrink-0 bg-white">
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

export default SchemeDetail;
