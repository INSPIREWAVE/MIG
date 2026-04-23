"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function invoke(channel, ...args) {
    return electron_1.ipcRenderer.invoke(channel, ...args);
}
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    auth: {
        login: (username, password) => invoke('auth:login', username, password),
        register: (payload) => invoke('auth:register', payload),
        changePassword: (username, old, next) => invoke('auth:changePassword', username, old, next),
        recover: (username, answer, newPw) => invoke('auth:recover', username, answer, newPw),
    },
    clients: {
        list: () => invoke('clients:list'),
        get: (id) => invoke('clients:get', id),
        create: (data) => invoke('clients:create', data),
        update: (id, data) => invoke('clients:update', id, data),
        delete: (id) => invoke('clients:delete', id),
        stats: (id) => invoke('clients:stats', id),
        risk: (id) => invoke('clients:risk', id),
        activity: (id, limit) => invoke('clients:activity', id, limit ?? 50),
        kyc: (id, status, notes) => invoke('clients:kyc', id, status, notes),
        blacklist: (id, bl, reason) => invoke('clients:blacklist', id, bl, reason),
    },
    loans: {
        list: () => invoke('loans:list'),
        get: (id) => invoke('loans:get', id),
        create: (data) => invoke('loans:create', data),
        update: (id, data) => invoke('loans:update', id, data),
        delete: (id) => invoke('loans:delete', id),
        installments: (id) => invoke('loans:installments', id),
        payments: (id) => invoke('loans:payments', id),
        summary: (id) => invoke('loans:summary', id),
        recalculate: (id) => invoke('loans:recalculate', id),
        assessDefault: (id) => invoke('loans:assessDefault', id),
        earlySettlement: (id) => invoke('loans:earlySettlement', id),
        earlySettle: (id, data) => invoke('loans:earlySettle', id, data),
        overdue: () => invoke('loans:overdue'),
        upcoming: (days) => invoke('loans:upcoming', days ?? 7),
        byClient: (clientId) => invoke('loans:byClient', clientId),
    },
    payments: {
        list: () => invoke('payments:list'),
        add: (data) => invoke('payments:add', data),
        reverse: (id, reason, by) => invoke('payments:reverse', id, reason, by),
        stats: (period) => invoke('payments:stats', period),
        pipeline: (days) => invoke('payments:pipeline', days ?? 7),
        profit: (start, end) => invoke('payments:profit', start, end),
        trends: () => invoke('payments:trends'),
        chartData: (period, groupBy) => invoke('payments:chartData', period, groupBy),
    },
    penalties: {
        list: () => invoke('penalties:list'),
        add: (data) => invoke('penalties:add', data),
        updateStatus: (id, status) => invoke('penalties:updateStatus', id, status),
        delete: (id) => invoke('penalties:delete', id),
        applyAuto: () => invoke('penalties:applyAuto'),
    },
    collateral: {
        list: () => invoke('collateral:list'),
        byLoan: (loanId) => invoke('collateral:byLoan', loanId),
        byClient: (clientId) => invoke('collateral:byClient', clientId),
        add: (data) => invoke('collateral:add', data),
        update: (id, data) => invoke('collateral:update', id, data),
        delete: (id) => invoke('collateral:delete', id),
        forfeit: (id) => invoke('collateral:forfeit', id),
    },
    docs: {
        clientList: (clientId) => invoke('docs:clientList', clientId),
        clientAdd: (data) => invoke('docs:clientAdd', data),
        clientDelete: (id) => invoke('docs:clientDelete', id),
        companyList: () => invoke('docs:companyList'),
        companyAdd: (data) => invoke('docs:companyAdd', data),
        companyDelete: (id) => invoke('docs:companyDelete', id),
    },
    accounts: {
        list: () => invoke('accounts:list'),
        add: (data) => invoke('accounts:add', data),
        update: (id, data) => invoke('accounts:update', id, data),
        delete: (id) => invoke('accounts:delete', id),
        transactions: (limit) => invoke('accounts:transactions', limit ?? 100),
        addTransaction: (data) => invoke('accounts:addTransaction', data),
        balanceSheets: () => invoke('accounts:balanceSheets'),
        generateBS: (period) => invoke('accounts:generateBS', period),
    },
    audit: {
        list: (limit) => invoke('audit:list', limit ?? 100),
        clear: () => invoke('audit:clear'),
        delete: (id) => invoke('audit:delete', id),
    },
    settings: {
        get: (key) => invoke('settings:get', key),
        set: (key, value) => invoke('settings:set', key, value),
    },
    users: {
        list: () => invoke('users:list'),
        updateRole: (id, role, perms) => invoke('users:updateRole', id, role, perms),
        toggleStatus: (id, isActive) => invoke('users:toggleStatus', id, isActive),
        delete: (id) => invoke('users:delete', id),
    },
    reports: {
        batchAssessment: () => invoke('reports:batchAssessment'),
    },
    backups: {
        list: () => invoke('backups:list'),
        create: (type) => invoke('backups:create', type ?? 'manual'),
        restore: (id) => invoke('backups:restore', id),
        delete: (id) => invoke('backups:delete', id),
    },
    dialog: {
        openFile: (options) => invoke('dialog:openFile', options),
        saveFile: (options) => invoke('dialog:saveFile', options),
    },
    shell: {
        openPath: (filePath) => invoke('shell:openPath', filePath),
    },
    sync: {
        enqueue: (item) => invoke('sync:enqueue', item),
        getQueue: () => invoke('sync:getQueue'),
        clearQueue: () => invoke('sync:clearQueue'),
        removeItem: (id) => invoke('sync:removeItem', id),
    },
    app: {
        getVersion: () => invoke('app:getVersion'),
        getUserDataPath: () => invoke('app:getUserDataPath'),
        quit: () => invoke('app:quit'),
    },
});
