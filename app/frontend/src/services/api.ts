import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('mig-auth');
  if (raw) {
    try {
      const state = JSON.parse(raw);
      const token = state?.state?.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mig-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }).then((r) => r.data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then((r) => r.data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then((r) => r.data),
  register: (data: object) => api.post('/auth/register', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  recover: (data: object) => api.post('/auth/recover', data).then((r) => r.data),
  changePassword: (data: object) => api.post('/auth/change-password', data).then((r) => r.data),
};

// ─── Clients ───────────────────────────────────────────────────────────────
export const clients = {
  list: (params?: object) => api.get('/clients', { params }).then((r) => r.data),
  get: (id: number) => api.get(`/clients/${id}`).then((r) => r.data),
  create: (data: object) => api.post('/clients', data).then((r) => r.data),
  update: (id: number, data: object) => api.put(`/clients/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/clients/${id}`).then((r) => r.data),
  getLoans: (id: number) => api.get(`/clients/${id}/loans`).then((r) => r.data),
  getDocuments: (id: number) => api.get(`/clients/${id}/documents`).then((r) => r.data),
  getActivity: (id: number, limit = 50) =>
    api.get(`/clients/${id}/activity`, { params: { limit } }).then((r) => r.data),
  getStats: (id: number) => api.get(`/clients/${id}/stats`).then((r) => r.data),
  updateKyc: (id: number, data: object) => api.post(`/clients/${id}/kyc`, data).then((r) => r.data),
  setBlacklist: (id: number, data: object) =>
    api.post(`/clients/${id}/blacklist`, data).then((r) => r.data),
};

// ─── Loans ─────────────────────────────────────────────────────────────────
export const loans = {
  list: (params?: object) => api.get('/loans', { params }).then((r) => r.data),
  get: (id: number) => api.get(`/loans/${id}`).then((r) => r.data),
  create: (data: object) => api.post('/loans', data).then((r) => r.data),
  update: (id: number, data: object) => api.put(`/loans/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/loans/${id}`).then((r) => r.data),
  getInstallments: (id: number) => api.get(`/loans/${id}/installments`).then((r) => r.data),
  getPayments: (id: number) => api.get(`/loans/${id}/payments`).then((r) => r.data),
  getSummary: (id: number) => api.get(`/loans/${id}/summary`).then((r) => r.data),
  recalculate: (id: number) => api.post(`/loans/${id}/recalculate`).then((r) => r.data),
  assessDefault: (id: number) => api.post(`/loans/${id}/assess-default`).then((r) => r.data),
  getEarlySettlement: (id: number) =>
    api.get(`/loans/${id}/early-settlement`).then((r) => r.data),
  processEarlySettlement: (id: number, data: object) =>
    api.post(`/loans/${id}/early-settle`, data).then((r) => r.data),
  getOverdue: () => api.get('/loans/overdue').then((r) => r.data),
  getUpcoming: (days = 7) => api.get('/loans/upcoming', { params: { days } }).then((r) => r.data),
};

// ─── Payments ──────────────────────────────────────────────────────────────
export const payments = {
  list: (params?: object) => api.get('/payments', { params }).then((r) => r.data),
  add: (data: object) => api.post('/payments', data).then((r) => r.data),
  reverse: (id: number, data: object) =>
    api.post(`/payments/${id}/reverse`, data).then((r) => r.data),
  getStats: (period?: string) =>
    api.get('/payments/stats', { params: { period } }).then((r) => r.data),
  getPipeline: (days = 7) =>
    api.get('/payments/pipeline', { params: { days } }).then((r) => r.data),
  getProfit: (start?: string, end?: string) =>
    api.get('/payments/profit', { params: { start, end } }).then((r) => r.data),
  getCollectionTrends: () => api.get('/payments/collection-trends').then((r) => r.data),
};

// ─── Penalties ─────────────────────────────────────────────────────────────
export const penalties = {
  list: () => api.get('/penalties').then((r) => r.data),
  add: (data: object) => api.post('/penalties', data).then((r) => r.data),
  updateStatus: (id: number, status: string) =>
    api.put(`/penalties/${id}/status`, { status }).then((r) => r.data),
  delete: (id: number) => api.delete(`/penalties/${id}`).then((r) => r.data),
  applyAuto: () => api.post('/penalties/apply-auto').then((r) => r.data),
};

// ─── Collateral ────────────────────────────────────────────────────────────
export const collateral = {
  list: () => api.get('/collateral').then((r) => r.data),
  getByLoan: (loanId: number) => api.get(`/collateral/loan/${loanId}`).then((r) => r.data),
  getByClient: (clientId: number) => api.get(`/collateral/client/${clientId}`).then((r) => r.data),
  add: (data: object) => api.post('/collateral', data).then((r) => r.data),
  update: (id: number, data: object) => api.put(`/collateral/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/collateral/${id}`).then((r) => r.data),
  forfeit: (id: number) => api.post(`/collateral/${id}/forfeit`).then((r) => r.data),
};

// ─── Accounts ──────────────────────────────────────────────────────────────
export const accounts = {
  list: () => api.get('/accounts').then((r) => r.data),
  create: (data: object) => api.post('/accounts', data).then((r) => r.data),
  update: (id: number, data: object) => api.put(`/accounts/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/accounts/${id}`).then((r) => r.data),
  getTransactions: (limit = 100) =>
    api.get('/accounts/transactions', { params: { limit } }).then((r) => r.data),
  addTransaction: (data: object) =>
    api.post('/accounts/transactions', data).then((r) => r.data),
  getBalanceSheets: (limit = 20) =>
    api.get('/accounts/balance-sheets', { params: { limit } }).then((r) => r.data),
  createBalanceSheet: (period: string) =>
    api.post('/accounts/balance-sheets', { period }).then((r) => r.data),
};

// ─── Documents ─────────────────────────────────────────────────────────────
export const documents = {
  getClientDocs: (clientId: number) =>
    api.get(`/documents/client/${clientId}`).then((r) => r.data),
  uploadClientDoc: (clientId: number, formData: FormData) => {
    const payload = new FormData();
    formData.forEach((value, key) => payload.append(key, value));
    payload.set('clientId', String(clientId));
    return api.post('/documents/client', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  deleteClientDoc: (id: number) => api.delete(`/documents/client/${id}`).then((r) => r.data),
  getCompanyDocs: () => api.get('/documents/company').then((r) => r.data),
  uploadCompanyDoc: (formData: FormData) =>
    api.post('/documents/company', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  deleteCompanyDoc: (id: number) => api.delete(`/documents/company/${id}`).then((r) => r.data),
};

// ─── Audit ─────────────────────────────────────────────────────────────────
export const audit = {
  list: (limit = 100) => api.get('/audit', { params: { limit } }).then((r) => r.data),
  clear: () => api.delete('/audit').then((r) => r.data),
  deleteEntry: (id: number) => api.delete(`/audit/${id}`).then((r) => r.data),
};

// ─── Reports ───────────────────────────────────────────────────────────────
export const reports = {
  getDashboard: () => api.get('/reports/dashboard').then((r) => r.data),
  getPaymentChart: (period?: string, groupBy?: string) =>
    api.get('/reports/payment-chart', { params: { period, groupBy } }).then((r) => r.data),
  getDailyCollection: (date?: string) =>
    api.get('/reports/daily-collection', { params: { date } }).then((r) => r.data),
  runBatchAssessment: () => api.post('/reports/batch-assessment').then((r) => r.data),
};

// ─── Backups ───────────────────────────────────────────────────────────────
export const backups = {
  list: () => api.get('/backups').then((r) => r.data),
  create: (type = 'manual') => api.post('/backups', { type }).then((r) => r.data),
  restore: (id: number) => api.post(`/backups/${id}/restore`).then((r) => r.data),
  delete: (id: number) => api.delete(`/backups/${id}`).then((r) => r.data),
};

// ─── Settings ──────────────────────────────────────────────────────────────
export const settings = {
  get: (key: string) => api.get(`/settings/${key}`).then((r) => r.data),
  set: (key: string, value: unknown) => api.put('/settings', { key, value }).then((r) => r.data),
};

// ─── Users ─────────────────────────────────────────────────────────────────
export const users = {
  list: () => api.get('/users').then((r) => r.data),
  updateRole: (id: number, role: string, permissions: string) =>
    api.put(`/users/${id}/role`, { role, permissions }).then((r) => r.data),
  toggleStatus: (id: number, isActive: boolean) =>
    api.put(`/users/${id}/status`, { isActive }).then((r) => r.data),
  delete: (id: number) => api.delete(`/users/${id}`).then((r) => r.data),
};

export default api;
