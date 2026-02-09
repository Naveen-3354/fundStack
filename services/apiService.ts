
import axios from 'axios';
import { MutualFund, Scheme, RiskLevel, SchemeType, FundHouse } from '../types';

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

export const apiService = {
  getFundHouses: async (): Promise<FundHouse[]> => {
    try {
      // Calling the local API. If it fails, we return an empty array (no hardcoded fallback).
      const response = await axios.get<FundHouse[]>('http://localhost:8080/fund-house');
      return response.data;
    } catch (error) {
      console.error('API is unreachable at http://localhost:8080/fund-house');
      return [];
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
