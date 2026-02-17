
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

export interface SchemeApiItem {
  id: number;
  name: string;
  amfiId: string;
}

export interface SchemePageResponse {
  data: SchemeApiItem[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SchemeOverview {
  id: number;
  mfName: string;
  schemeName: string;
  schemeTypeDesc: string;
  schemeCatDesc: string;
  schemeObjective: string;
  schemeLoad: string;
  schemeMinAmt: string;
  launchDate: string;
  amcWebsite: string;
}

export interface SchemeNavOption {
  schemeNavName: string;
  code: string;
  isinDivPayOut: string | null;
  isinGrowthAndReinvest: string | null;
  launchDate: string | null;
}

export interface GroupedMigrationScheme {
  schemeName: string;
  navOptions: SchemeNavOption[];
}

export interface GroupedMigrationResponse {
  data: GroupedMigrationScheme[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
