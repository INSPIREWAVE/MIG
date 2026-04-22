import { contextBridge, ipcRenderer } from 'electron';

function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  return ipcRenderer.invoke(channel, ...args);
}

contextBridge.exposeInMainWorld('electronAPI', {
  auth: {
    login: (username: string, password: string) => invoke('auth:login', username, password),
    register: (payload: unknown) => invoke('auth:register', payload),
    changePassword: (username: string, old: string, next: string) => invoke('auth:changePassword', username, old, next),
    recover: (username: string, answer: string, newPw: string) => invoke('auth:recover', username, answer, newPw),
  },
  clients: {
    list: () => invoke('clients:list'),
    get: (id: number) => invoke('clients:get', id),
    create: (data: unknown) => invoke('clients:create', data),
    update: (id: number, data: unknown) => invoke('clients:update', id, data),
    delete: (id: number) => invoke('clients:delete', id),
    stats: (id: number) => invoke('clients:stats', id),
    risk: (id: number) => invoke('clients:risk', id),
    activity: (id: number, limit?: number) => invoke('clients:activity', id, limit ?? 50),
    kyc: (id: number, status: string, notes: string) => invoke('clients:kyc', id, status, notes),
    blacklist: (id: number, bl: boolean, reason: string) => invoke('clients:blacklist', id, bl, reason),
  },
  loans: {
    list: () => invoke('loans:list'),
    get: (id: number) => invoke('loans:get', id),
    create: (data: unknown) => invoke('loans:create', data),
    update: (id: number, data: unknown) => invoke('loans:update', id, data),
    delete: (id: number) => invoke('loans:delete', id),
    installments: (id: number) => invoke('loans:installments', id),
    payments: (id: number) => invoke('loans:payments', id),
    summary: (id: number) => invoke('loans:summary', id),
    recalculate: (id: number) => invoke('loans:recalculate', id),
    assessDefault: (id: number) => invoke('loans:assessDefault', id),
    earlySettlement: (id: number) => invoke('loans:earlySettlement', id),
    earlySettle: (id: number, data: unknown) => invoke('loans:earlySettle', id, data),
    overdue: () => invoke('loans:overdue'),
    upcoming: (days?: number) => invoke('loans:upcoming', days ?? 7),
    byClient: (clientId: number) => invoke('loans:byClient', clientId),
  },
  payments: {
    list: () => invoke('payments:list'),
    add: (data: unknown) => invoke('payments:add', data),
    reverse: (id: number, reason: string, by: string) => invoke('payments:reverse', id, reason, by),
    stats: (period?: string) => invoke('payments:stats', period),
    pipeline: (days?: number) => invoke('payments:pipeline', days ?? 7),
    profit: (start: string, end: string) => invoke('payments:profit', start, end),
    trends: () => invoke('payments:trends'),
    chartData: (period: string, groupBy: string) => invoke('payments:chartData', period, groupBy),
  },
  penalties: {
    list: () => invoke('penalties:list'),
    add: (data: unknown) => invoke('penalties:add', data),
    updateStatus: (id: number, status: string) => invoke('penalties:updateStatus', id, status),
    delete: (id: number) => invoke('penalties:delete', id),
    applyAuto: () => invoke('penalties:applyAuto'),
  },
  collateral: {
    list: () => invoke('collateral:list'),
    byLoan: (loanId: number) => invoke('collateral:byLoan', loanId),
    byClient: (clientId: number) => invoke('collateral:byClient', clientId),
    add: (data: unknown) => invoke('collateral:add', data),
    update: (id: number, data: unknown) => invoke('collateral:update', id, data),
    delete: (id: number) => invoke('collateral:delete', id),
    forfeit: (id: number) => invoke('collateral:forfeit', id),
  },
  docs: {
    clientList: (clientId: number) => invoke('docs:clientList', clientId),
    clientAdd: (data: unknown) => invoke('docs:clientAdd', data),
    clientDelete: (id: number) => invoke('docs:clientDelete', id),
    companyList: () => invoke('docs:companyList'),
    companyAdd: (data: unknown) => invoke('docs:companyAdd', data),
    companyDelete: (id: number) => invoke('docs:companyDelete', id),
  },
  accounts: {
    list: () => invoke('accounts:list'),
    add: (data: unknown) => invoke('accounts:add', data),
    update: (id: number, data: unknown) => invoke('accounts:update', id, data),
    delete: (id: number) => invoke('accounts:delete', id),
    transactions: (limit?: number) => invoke('accounts:transactions', limit ?? 100),
    addTransaction: (data: unknown) => invoke('accounts:addTransaction', data),
    balanceSheets: () => invoke('accounts:balanceSheets'),
    generateBS: (period: string) => invoke('accounts:generateBS', period),
  },
  audit: {
    list: (limit?: number) => invoke('audit:list', limit ?? 100),
    clear: () => invoke('audit:clear'),
    delete: (id: number) => invoke('audit:delete', id),
  },
  settings: {
    get: (key: string) => invoke('settings:get', key),
    set: (key: string, value: string) => invoke('settings:set', key, value),
  },
  users: {
    list: () => invoke('users:list'),
    updateRole: (id: number, role: string, perms: string) => invoke('users:updateRole', id, role, perms),
    toggleStatus: (id: number, isActive: boolean) => invoke('users:toggleStatus', id, isActive),
    delete: (id: number) => invoke('users:delete', id),
  },
  reports: {
    batchAssessment: () => invoke('reports:batchAssessment'),
  },
  backups: {
    list: () => invoke('backups:list'),
    create: (type?: string) => invoke('backups:create', type ?? 'manual'),
    restore: (id: number) => invoke('backups:restore', id),
    delete: (id: number) => invoke('backups:delete', id),
  },
  dialog: {
    openFile: (options: unknown) => invoke('dialog:openFile', options),
    saveFile: (options: unknown) => invoke('dialog:saveFile', options),
  },
  shell: {
    openPath: (filePath: string) => invoke('shell:openPath', filePath),
  },
  sync: {
    enqueue: (item: unknown) => invoke('sync:enqueue', item),
    getQueue: () => invoke('sync:getQueue'),
    clearQueue: () => invoke('sync:clearQueue'),
    removeItem: (id: string) => invoke('sync:removeItem', id),
  },
  app: {
    getVersion: () => invoke('app:getVersion'),
    getUserDataPath: () => invoke('app:getUserDataPath'),
    quit: () => invoke('app:quit'),
  },
});
