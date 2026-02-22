
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
  schemeType?: string | null;
  schemeTypeDesc?: string | null;
  schemeCatDesc?: string | null;
  schemeObjective?: string | null;
  description?: string | null;
  schemeLoad?: string | null;
  entryLoad?: string | null;
  exitLoad?: string | null;
  schemeMinAmt?: string | null;
  launchDate?: string | null;
  allotmentDate?: string | null;
  nfoOpenDate?: string | null;
  nfoCloseDate?: string | null;
  reopenDate?: string | null;
  maturityDate?: string | null;
  amcWebsite?: string | null;
  annualExpenseDir?: string | null;
  annualExpenseReg?: string | null;
  auditor?: string | null;
  benchmark1?: string | null;
  benchmark2?: string | null;
  custodian?: string | null;
  faceValue?: string | null;
  potentialRiskoMeter?: string | null;
  riskoMeterAsOnDate?: string | null;
  riskoMeterAtLaunch?: string | null;
  registrar?: string | null;
  sidePocketing?: string | null;
  assetAllocation?: string | null;
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

export interface SchemePlanOption {
  id: number;
  schemeNavName: string;
  amfiCode: string | null;
  optionType: string | null;
  planType: string | null;
  rtaSchemeCode: string | null;
  isinDivPayoutIsinGrowth: string | null;
  isinDivReinvestment: string | null;
  sebiCode: string | null;
}

export interface SystemTransactionRule {
  id: number;
  type: string | null;
  frequency: string | null;
  dayOrDates: Array<string | number>;
  minAmount: number | null;
  maxAmount: number | null;
  minInstallments: number | null;
  multiplier: number | null;
}

export interface SchemeTransactionDetail {
  id: number;
  maxRedAmt: number | null;
  maxRedUnit: string | null;
  minRedAmt: number | null;
  minRedUnit: string | null;
  minBalAmt: number | null;
  minBalUnit: string | null;
  minSwtAmt: number | null;
  minSwtUnit: string | null;
  minimumAddAmount: number | null;
  minimumAddAmountInMul: number | null;
  minimumAppAmount: number | null;
  minimumAppAmountInMul: number | null;
  swgPrice: number | null;
  swtMulAmt: number | null;
  swtMulUnit: string | null;
  systemTransactionRules: SystemTransactionRule[];
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
