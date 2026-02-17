
import axios from 'axios';
import {
  MutualFund,
  Scheme,
  RiskLevel,
  SchemeType,
  FundHouse,
  SchemePageResponse,
  SchemeOverview,
  GroupedMigrationResponse
} from '../types';

const STORAGE_KEYS = {
  FUNDS: 'mf_admin_funds',
  SCHEMES: 'mf_admin_schemes'
};

const getStored = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStored = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getApiBaseUrl = (): string => {
  return (import.meta as any).env?.VITE_API_BASE_URL?.toString() ?? '';
};

const buildApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!baseUrl) {
    return normalizedPath;
  }
  return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
};

export const apiService = {
  getFundHouses: async (): Promise<FundHouse[]> => {
    try {
      // Use a configurable base URL so dev server proxy or same-origin can avoid CORS.
      // Example: VITE_API_BASE_URL=/api (with Vite proxy) or http://localhost:8080
      const response = await axios.get<FundHouse[]>(buildApiUrl('/fund-house'));
      return response.data;
    } catch (error) {
      console.error('Fund house API request failed (likely CORS or network).');
      return [];
    }
  },

  getSchemesByAmfi: async (amfiId: string): Promise<Record<string, unknown>[]> => {
    try {
      const safeAmfi = encodeURIComponent(amfiId);
      const response = await axios.get<Record<string, unknown>[]>(
        buildApiUrl(`/scheme/amfi/${safeAmfi}`)
      );
      return response.data;
    } catch (error) {
      console.error(`Scheme API request failed for AMFI ${amfiId}.`);
      return [];
    }
  },

  getSchemesPage: async (params: {
    pageNo: number;
    pageSize: number;
    fundHouseId?: string;
    search?: string;
  }): Promise<SchemePageResponse | null> => {
    try {
      const query = new URLSearchParams();
      query.set('pageNo', params.pageNo.toString());
      query.set('pageSize', params.pageSize.toString());
      if (params.fundHouseId) {
        query.set('fundHouseId', params.fundHouseId);
      }
      if (params.search) {
        query.set('search', params.search);
      }
      const url = buildApiUrl(`/scheme/page?${query.toString()}`);
      const response = await axios.get<SchemePageResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Scheme page API request failed.');
      return null;
    }
  },

  getSchemeOverview: async (schemeId: string): Promise<SchemeOverview | null> => {
    try {
      const safeId = encodeURIComponent(schemeId);
      const response = await axios.get<SchemeOverview>(
        buildApiUrl(`/scheme/${safeId}/overview/sysnc`)
      );
      return response.data ?? null;
    } catch (error) {
      console.error(`Scheme overview API request failed for id ${schemeId}.`);
      return null;
    }
  },

  getGroupedMigrationSchemes: async (params: {
    pageNo: number;
    pageSize: number;
  }): Promise<GroupedMigrationResponse | null> => {
    try {
      const query = new URLSearchParams();
      query.set('pageNo', params.pageNo.toString());
      query.set('pageSize', params.pageSize.toString());
      const url = buildApiUrl(`/api/admin/migration/grouped?${query.toString()}`);
      const response = await axios.get<GroupedMigrationResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Grouped migration API request failed.');
      return null;
    }
  },

  loadSchemeCsv: async (): Promise<boolean> => {
    try {
      await axios.get(buildApiUrl('/scheme/getschemeCsv'));
      return true;
    } catch (error) {
      console.error('Scheme CSV load API request failed.');
      return false;
    }
  },

  migrateSchemeByName: async (schemeName: string): Promise<boolean> => {
    try {
      await axios.post(buildApiUrl('/api/admin/migration/scheme-name'), { schemeName });
      return true;
    } catch (error) {
      console.error('Scheme migration API request failed.');
      return false;
    }
  },

  getFunds: async (page: number = 1, limit: number = 10) => {
    await delay(300);
    const all = getStored<MutualFund>(STORAGE_KEYS.FUNDS);
    return {
      data: all.slice((page - 1) * limit, page * limit),
      total: all.length,
      page,
      limit
    };
  },
  
  getSchemes: async (page: number = 1, limit: number = 10) => {
    await delay(300);
    const funds = getStored<MutualFund>(STORAGE_KEYS.FUNDS);
    const schemes = getStored<Scheme>(STORAGE_KEYS.SCHEMES);
    const enriched = schemes.map(s => ({
      ...s,
      fundName: funds.find(f => f.id === s.fundId)?.name || 'Unknown Fund'
    }));
    return {
      data: enriched.slice((page - 1) * limit, page * limit),
      total: enriched.length,
      page,
      limit
    };
  },

  createFund: async (fund: Omit<MutualFund, 'id'>) => {
    await delay(400);
    const all = getStored<MutualFund>(STORAGE_KEYS.FUNDS);
    const newFund = { ...fund, id: Math.random().toString(36).substr(2, 9) };
    setStored(STORAGE_KEYS.FUNDS, [newFund, ...all]);
    return newFund;
  },

  createScheme: async (scheme: Omit<Scheme, 'id'>) => {
    await delay(400);
    const all = getStored<Scheme>(STORAGE_KEYS.SCHEMES);
    const newScheme = { ...scheme, id: 's' + Math.random().toString(36).substr(2, 7) };
    setStored(STORAGE_KEYS.SCHEMES, [newScheme, ...all]);
    return newScheme;
  },

  clearAllData: async () => {
    await delay(500);
    localStorage.removeItem(STORAGE_KEYS.FUNDS);
    localStorage.removeItem(STORAGE_KEYS.SCHEMES);
    return true;
  },

  deleteFund: async (id: string) => {
    await delay(300);
    const allFunds = getStored<MutualFund>(STORAGE_KEYS.FUNDS).filter(f => f.id !== id);
    const allSchemes = getStored<Scheme>(STORAGE_KEYS.SCHEMES).filter(s => s.fundId !== id);
    setStored(STORAGE_KEYS.FUNDS, allFunds);
    setStored(STORAGE_KEYS.SCHEMES, allSchemes);
    return true;
  }
};
