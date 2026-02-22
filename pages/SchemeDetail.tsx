import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { SchemeApiItem, SchemeOverview, SchemePlanOption, SchemeTransactionDetail } from '../types';

const formatDate = (iso?: string) => {
  if (!iso) {
    return 'N/A';
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
};

const display = (value?: string | null) => {
  return value && value.trim() ? value : 'N/A';
};

const displayNum = (value?: number | null) => {
  return typeof value === 'number' ? value.toLocaleString('en-IN') : 'N/A';
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
  const [planOptions, setPlanOptions] = useState<SchemePlanOption[]>([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<SchemeTransactionDetail | null>(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const schemeId = useMemo(() => id ?? '', [id]);

  const fetchOverview = async () => {
    if (!schemeId) {
      setOverview(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let data = await apiService.getSchemeOverview(schemeId);
      
      if(data == null){
        data = await apiService.getSchemeOverviewSync(schemeId);
      }
      
      setOverview(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [schemeId]);

  useEffect(() => {
    const fetchPlanOptions = async () => {
      if (!schemeId) {
        setPlanOptions([]);
        return;
      }
      setPlanLoading(true);
      try {
        const data = await apiService.getSchemePlanOptions(schemeId);
        setPlanOptions(data);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchPlanOptions();
  }, [schemeId]);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!schemeId) {
        setTransactionDetail(null);
        return;
      }
      setTransactionLoading(true);
      try {
        const data = await apiService.getSchemeTransactionDetail(schemeId);
        setTransactionDetail(data);
      } finally {
        setTransactionLoading(false);
      }
    };
    fetchTransactionDetail();
  }, [schemeId]);

  const openEdit = () => {
    setEditForm(
      overview ?? {
        id: schemeId ? Number(schemeId) : -1,
        mfName: scheme?.amfiId ? scheme.amfiId : '',
        schemeName: scheme?.name ?? '',
        schemeType: '',
        schemeTypeDesc: '',
        schemeCatDesc: '',
        schemeObjective: '',
        description: '',
        schemeLoad: '',
        entryLoad: '',
        exitLoad: '',
        schemeMinAmt: '',
        launchDate: '',
        allotmentDate: '',
        nfoOpenDate: '',
        nfoCloseDate: '',
        reopenDate: '',
        maturityDate: '',
        amcWebsite: '',
        annualExpenseDir: '',
        annualExpenseReg: '',
        auditor: '',
        benchmark1: '',
        benchmark2: '',
        custodian: '',
        faceValue: '',
        potentialRiskoMeter: '',
        riskoMeterAsOnDate: '',
        riskoMeterAtLaunch: '',
        registrar: '',
        sidePocketing: '',
        assetAllocation: ''
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
    const data = await apiService.getSchemeOverviewSync(schemeId);
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
              <div className="text-sm text-slate-500 mt-1">{display(overview.schemeCatDesc)}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Objective</div>
              <p className="text-sm text-slate-600 whitespace-pre-line">
                {display(overview.schemeObjective ?? overview.description)}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Entry Load</div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{display(overview.entryLoad ?? overview.schemeLoad)}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Exit Load</div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{display(overview.exitLoad)}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Asset Allocation</div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{display(overview.assetAllocation)}</p>
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
                <div className="text-sm text-slate-700">{display(overview.schemeType ?? overview.schemeTypeDesc)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Minimum Amount</div>
                <div className="text-sm text-slate-700">{display(overview.schemeMinAmt)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Launch Date</div>
                <div className="text-sm text-slate-700">{formatDate(overview.launchDate)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Allotment Date</div>
                <div className="text-sm text-slate-700">{formatDate(overview.allotmentDate ?? undefined)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">NFO Open Date</div>
                <div className="text-sm text-slate-700">{formatDate(overview.nfoOpenDate ?? undefined)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">NFO Close Date</div>
                <div className="text-sm text-slate-700">{formatDate(overview.nfoCloseDate ?? undefined)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reopen Date</div>
                <div className="text-sm text-slate-700">{formatDate(overview.reopenDate ?? undefined)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Meter (As On)</div>
                <div className="text-sm text-slate-700">{display(overview.riskoMeterAsOnDate)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Meter (At Launch)</div>
                <div className="text-sm text-slate-700">{display(overview.riskoMeterAtLaunch)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expense Ratio (Direct)</div>
                <div className="text-sm text-slate-700">{display(overview.annualExpenseDir)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expense Ratio (Regular)</div>
                <div className="text-sm text-slate-700">{display(overview.annualExpenseReg)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Benchmark</div>
                <div className="text-sm text-slate-700 whitespace-pre-line">
                  {display([overview.benchmark1, overview.benchmark2].filter(Boolean).join('\n'))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Registrar</div>
                <div className="text-sm text-slate-700">{display(overview.registrar)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custodian</div>
                <div className="text-sm text-slate-700">{display(overview.custodian)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Auditor</div>
                <div className="text-sm text-slate-700">{display(overview.auditor)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Face Value</div>
                <div className="text-sm text-slate-700">{display(overview.faceValue)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Side Pocketing</div>
                <div className="text-sm text-slate-700">{display(overview.sidePocketing)}</div>
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plan Options</div>
            <div className="text-sm text-slate-500">Endpoint: /api/scheme-plan/{schemeId || 'id'}/options</div>
          </div>
          <div className="text-xs text-slate-500">Total: {planOptions.length}</div>
        </div>

        {planLoading ? (
          <div className="text-sm text-slate-400">Loading plan options...</div>
        ) : planOptions.length === 0 ? (
          <div className="text-sm text-slate-500">No plan options found.</div>
        ) : (
          <div className="space-y-3">
            {planOptions.map((option) => (
              <div key={option.id} className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="text-sm font-semibold text-slate-900">{display(option.schemeNavName)}</div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <div><span className="text-slate-500">AMFI Code:</span> <span className="text-slate-800">{display(option.amfiCode)}</span></div>
                  <div><span className="text-slate-500">Plan Type:</span> <span className="text-slate-800">{display(option.planType)}</span></div>
                  <div><span className="text-slate-500">Option Type:</span> <span className="text-slate-800">{display(option.optionType)}</span></div>
                  <div><span className="text-slate-500">RTA Scheme Code:</span> <span className="text-slate-800">{display(option.rtaSchemeCode)}</span></div>
                  <div><span className="text-slate-500">ISIN Growth/Payout:</span> <span className="text-slate-800">{display(option.isinDivPayoutIsinGrowth)}</span></div>
                  <div><span className="text-slate-500">ISIN Reinvestment:</span> <span className="text-slate-800">{display(option.isinDivReinvestment)}</span></div>
                  <div><span className="text-slate-500">SEBI Code:</span> <span className="text-slate-800">{display(option.sebiCode)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Details</div>
            <div className="text-sm text-slate-500">Endpoint: /api/transaction-detial/{schemeId || 'id'}</div>
          </div>
        </div>

        {transactionLoading ? (
          <div className="text-sm text-slate-400">Loading transaction details...</div>
        ) : !transactionDetail ? (
          <div className="text-sm text-slate-500">No transaction details found.</div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div><span className="text-slate-500">Min Redemption Amt:</span> <span className="text-slate-800">{displayNum(transactionDetail.minRedAmt)}</span></div>
              <div><span className="text-slate-500">Min Redemption Unit:</span> <span className="text-slate-800">{display(transactionDetail.minRedUnit)}</span></div>
              <div><span className="text-slate-500">Max Redemption Amt:</span> <span className="text-slate-800">{displayNum(transactionDetail.maxRedAmt)}</span></div>
              <div><span className="text-slate-500">Max Redemption Unit:</span> <span className="text-slate-800">{display(transactionDetail.maxRedUnit)}</span></div>
              <div><span className="text-slate-500">Min Balance Amt:</span> <span className="text-slate-800">{displayNum(transactionDetail.minBalAmt)}</span></div>
              <div><span className="text-slate-500">Min Balance Unit:</span> <span className="text-slate-800">{display(transactionDetail.minBalUnit)}</span></div>
              <div><span className="text-slate-500">Min Switch Amt:</span> <span className="text-slate-800">{displayNum(transactionDetail.minSwtAmt)}</span></div>
              <div><span className="text-slate-500">Min Switch Unit:</span> <span className="text-slate-800">{display(transactionDetail.minSwtUnit)}</span></div>
              <div><span className="text-slate-500">Min Add Amount:</span> <span className="text-slate-800">{displayNum(transactionDetail.minimumAddAmount)}</span></div>
              <div><span className="text-slate-500">Min Add Mul:</span> <span className="text-slate-800">{displayNum(transactionDetail.minimumAddAmountInMul)}</span></div>
              <div><span className="text-slate-500">Min App Amount:</span> <span className="text-slate-800">{displayNum(transactionDetail.minimumAppAmount)}</span></div>
              <div><span className="text-slate-500">Min App Mul:</span> <span className="text-slate-800">{displayNum(transactionDetail.minimumAppAmountInMul)}</span></div>
              <div><span className="text-slate-500">SWG Price:</span> <span className="text-slate-800">{displayNum(transactionDetail.swgPrice)}</span></div>
              <div><span className="text-slate-500">Switch Mul Amt:</span> <span className="text-slate-800">{displayNum(transactionDetail.swtMulAmt)}</span></div>
              <div><span className="text-slate-500">Switch Mul Unit:</span> <span className="text-slate-800">{display(transactionDetail.swtMulUnit)}</span></div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Type</th>
                    <th className="px-3 py-2 text-left font-semibold">Frequency</th>
                    <th className="px-3 py-2 text-left font-semibold">Min Amount</th>
                    <th className="px-3 py-2 text-left font-semibold">Max Amount</th>
                    <th className="px-3 py-2 text-left font-semibold">Min Installments</th>
                    <th className="px-3 py-2 text-left font-semibold">Multiplier</th>
                    <th className="px-3 py-2 text-left font-semibold">Days/Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionDetail.systemTransactionRules.length === 0 ? (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={7}>No system transaction rules.</td>
                    </tr>
                  ) : (
                    transactionDetail.systemTransactionRules.map((rule) => (
                      <tr key={rule.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-800">{display(rule.type)}</td>
                        <td className="px-3 py-2 text-slate-800">{display(rule.frequency)}</td>
                        <td className="px-3 py-2 text-slate-800">{displayNum(rule.minAmount)}</td>
                        <td className="px-3 py-2 text-slate-800">{displayNum(rule.maxAmount)}</td>
                        <td className="px-3 py-2 text-slate-800">{displayNum(rule.minInstallments)}</td>
                        <td className="px-3 py-2 text-slate-800">{displayNum(rule.multiplier)}</td>
                        <td className="px-3 py-2 text-slate-800">{rule.dayOrDates.length ? rule.dayOrDates.join(', ') : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
                  value={editForm.schemeType ?? editForm.schemeTypeDesc ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, schemeType: e.target.value, schemeTypeDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category Description</label>
                <input
                  value={editForm.schemeCatDesc ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, schemeCatDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Objective</label>
                <textarea
                  value={editForm.schemeObjective ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, schemeObjective: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Entry Load</label>
                <textarea
                  value={editForm.entryLoad ?? editForm.schemeLoad ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, entryLoad: e.target.value, schemeLoad: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Exit Load</label>
                <textarea
                  value={editForm.exitLoad ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, exitLoad: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Minimum Amount</label>
                <input
                  value={editForm.schemeMinAmt ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, schemeMinAmt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Launch Date</label>
                <input
                  value={editForm.launchDate ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, launchDate: e.target.value })}
                  placeholder="2023-09-03T18:30:00Z"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Allotment Date</label>
                <input
                  value={editForm.allotmentDate ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, allotmentDate: e.target.value })}
                  placeholder="2023-09-25"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Risk Meter (As On)</label>
                <input
                  value={editForm.riskoMeterAsOnDate ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, riskoMeterAsOnDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Risk Meter (At Launch)</label>
                <input
                  value={editForm.riskoMeterAtLaunch ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, riskoMeterAtLaunch: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Expense (Direct)</label>
                <input
                  value={editForm.annualExpenseDir ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, annualExpenseDir: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Asset Allocation</label>
                <textarea
                  value={editForm.assetAllocation ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, assetAllocation: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AMC Website</label>
                <input
                  value={editForm.amcWebsite ?? ''}
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
