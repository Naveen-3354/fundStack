
export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  VERY_HIGH = 'Very High'
}

export enum SchemeType {
  OPEN_ENDED = 'Open Ended',
  CLOSE_ENDED = 'Close Ended'
}

export interface MutualFund {
  id: string;
  name: string;
  amcName: string; // Asset Management Company
  aum: number; // Assets Under Management in Millions
  category: string;
  foundedDate: string;
  active: boolean;
}

export interface Scheme {
  id: string;
  fundId: string;
  fundName?: string;
  name: string;
  type: SchemeType;
  riskLevel: RiskLevel;
  nav: number; // Net Asset Value
  expenseRatio: number;
  returns1Y: number;
  returns3Y: number;
}

export interface FundHouse {
  id: number;
  name: string;
  amfiId: string;
  camsKraCode: string | null;
  karvyKraCode: string | null;
  active: boolean;
  imageUrl: string | null;
  fundType: string;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
