import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { GroupedMigrationScheme } from '../types';

const SchemeMigration: React.FC = () => {
  const [schemes, setSchemes] = useState<GroupedMigrationScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [csvLoading, setCsvLoading] = useState(false);
  const [migratingKeys, setMigratingKeys] = useState<Boolean>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchGroupedSchemes = async (nextPage: number, nextPageSize: number) => {
    setLoading(true);
    try {
      const response = await apiService.getGroupedMigrationSchemes({
        pageNo: nextPage,
        pageSize: nextPageSize
      });
      if (response) {
        setSchemes(response.data ?? []);
        setTotalPages(response.totalPages ?? 0);
        setTotalCount(response.totalCount ?? 0);
      } else {
        setSchemes([]);
        setTotalPages(0);
        setTotalCount(0);
      }
    } catch (error) {
      console.error(error);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedSchemes(page, pageSize);
  }, [page, pageSize]);

  const handleLoadCsv = async () => {
    setCsvLoading(true);
    try {
      await apiService.loadSchemeCsv();
      await fetchGroupedSchemes(page, pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setCsvLoading(false);
    }
  };

  const handleMigrate = async (schemeName: string, rowKey: string) => {
    setMigratingKeys(prev => ({ ...prev, [rowKey]: true }));
    try {
      await apiService.migrateSchemeByName(schemeName);
    } catch (error) {
      console.error(error);
    } finally {
      setMigratingKeys(prev => ({ ...prev, [rowKey]: false }));
    }
  };

  const isMigrating = Object.values(migratingKeys).some(v => v === true);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scheme Migration</h1>
          <p className="text-sm text-slate-400">Grouped scheme data for CSV migration and NAV option level migration.</p>
        </div>
        <button
          onClick={handleLoadCsv}
          disabled={csvLoading}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {csvLoading ? 'Loading CSV...' : 'Load CSV'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-end gap-4">
        <div className="min-w-[140px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(0);
              setPageSize(Number(e.target.value));
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            {[5, 10, 20].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => fetchGroupedSchemes(page, pageSize)}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
        >
          Refresh
        </button>
        <div className="text-xs text-slate-500 ml-auto">
          Total schemes: <span className="font-bold text-slate-900">{totalCount}</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-sm text-slate-500">
          Loading grouped schemes...
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-sm text-slate-500">
          No grouped scheme data available.
        </div>
      ) : (
        <div className="space-y-4">
          {schemes.map((scheme, schemeIndex) => (
            <div key={`${scheme.schemeName}-${schemeIndex}`} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{scheme.schemeName}</h3>
                <button
                  key={scheme.id}
                  onClick={() => handleMigrate(scheme.schemeName, scheme.id)}
                  disabled={isMigrating}
                  className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isMigrating ? 'Migrating...' : 'Migrate'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">NAV Name</th>
                      <th className="text-left p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Code</th>
                      <th className="text-left p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">ISIN Div Payout</th>
                      <th className="text-left p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">ISIN Growth/Reinvest</th>
                      <th className="text-left p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Launch Date</th>
                      <th className="text-left p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Migration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheme.navOptions.map((nav, navIndex) => {
                      const rowKey = `${scheme.schemeName}-${nav.code}-${navIndex}`;
                      const isMigrating = migratingKeys[rowKey] === true;
                      return (
                        <tr key={rowKey} className="border-b border-slate-100 last:border-b-0">
                          <td className="p-3 text-slate-700">{nav.schemeNavName}</td>
                          <td className="p-3 font-mono text-indigo-600">{nav.code}</td>
                          <td className="p-3 text-slate-700">{nav.isinDivPayOut || '-'}</td>
                          <td className="p-3 text-slate-700">{nav.isinGrowthAndReinvest || '-'}</td>
                          <td className="p-3 text-slate-700">{nav.launchDate || '-'}</td>
                          <td className="p-3 text-slate-700">{nav.migrated? 'Migrated' : 'Not Migrated'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-xs text-slate-500">
          Page <span className="font-bold text-slate-900">{page + 1}</span> of <span className="font-bold text-slate-900">{Math.max(totalPages, 1)}</span>
        </div>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={totalPages > 0 && page + 1 >= totalPages}
          className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {csvLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-6 py-4 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
            <span className="text-sm text-slate-700 font-medium">Loading CSV data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeMigration;
