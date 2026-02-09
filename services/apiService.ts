
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
      const response = await axios.get<FundHouse[]>('http://localhost:8080/fund-house');
      return response.data;
    } catch (error) {
      console.error('Axios Fetch Error:', error);
      // Fallback for demonstration if local API is not running
      return [
        {
            "id": 1,
            "name": "360 ONE Mutual Fund",
            "amfiId": "62",
            "camsKraCode": null,
            "karvyKraCode": null,
            "active": true,
            "imageUrl": null,
            "fundType": "MF"
        },
        {
            "id": 2,
            "name": "Aditya Birla Sun Life Mutual Fund",
            "amfiId": "3",
            "camsKraCode": null,
            "karvyKraCode": null,
            "active": true,
            "imageUrl": null,
            "fundType": "MF"
        }
      ];
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

  updateFund: async (id: string, updates: Partial<MutualFund>) => {
    await delay(300);
    const all = getStored<MutualFund>(STORAGE_KEYS.FUNDS);
    const index = all.findIndex(f => f.id === id);
    if (index > -1) {
      all[index] = { ...all[index], ...updates };
      setStored(STORAGE_KEYS.FUNDS, all);
    }
    return all[index];
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
