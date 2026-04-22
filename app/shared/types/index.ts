export type EntityId = string | number;

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  permissions: string;
  isActive: number;
  lastLogin?: string;
}

export interface Client {
  id: number;
  clientNumber: string;
  name: string;
  phone: string;
  nrc?: string;
  email?: string;
  notes?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  creditScore?: number;
  riskLevel?: string;
  clientStatus?: string;
  blacklisted?: number;
  kycStatus?: string;
  created_at: string;
}

export interface Loan {
  id: number;
  loanNumber: string;
  clientId: number;
  clientName?: string;
  amount: number;
  interest: number;
  loanDate: string;
  dueDate: string;
  status: string;
  loanType?: string;
  duration?: number;
  totalPayable?: number;
  installmentAmount?: number;
  remainingBalance?: number;
  nextPaymentDate?: string;
  missedPayments?: number;
  daysOverdue?: number;
  riskLevel?: string;
  notes?: string;
}

export interface Installment {
  id: number;
  loanId: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principalPortion?: number;
  interestPortion?: number;
  paidAmount: number;
  paidDate?: string;
  status: string;
  lateFee?: number;
  notes?: string;
}

export interface Payment {
  id: number;
  loanId: number;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  receiptNumber?: string;
  referenceNumber?: string;
  status?: string;
  principalPortion?: number;
  interestPortion?: number;
  notes?: string;
}

export interface Collateral {
  id: number;
  clientId: number;
  loanId: number;
  itemType: string;
  description?: string;
  estimatedValue: number;
  acceptedValue?: number;
  status: string;
  imagePaths?: string[];
  notes?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType?: string;
  entityId?: number;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface KpiData {
  totalClients: number;
  activeLoans: number;
  portfolioValue: number;
  collectionRate: number;
  defaultRate: number;
  monthlyRevenue: number;
  overdueCount: number;
  totalCollateral: number;
}
