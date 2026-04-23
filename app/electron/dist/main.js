"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// DB module (same db.js used by backend)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = require('../../db.js');
let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development';
const userDataPath = electron_1.app.getPath('userData');
async function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        titleBarStyle: 'hiddenInset',
        show: false,
        backgroundColor: '#f9fafb',
    });
    if (isDev) {
        await mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        await mainWindow.loadFile(path_1.default.join(__dirname, '../../frontend/dist/index.html'));
    }
    mainWindow.once('ready-to-show', () => mainWindow?.show());
    mainWindow.on('closed', () => { mainWindow = null; });
}
electron_1.app.on('ready', async () => {
    await db.init(userDataPath);
    console.log('[Electron] DB initialized at', userDataPath);
    await createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', async () => {
    if (mainWindow === null)
        await createWindow();
});
// ============================================================
// IPC HANDLERS — all db operations exposed to renderer
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleDb(channel, fn) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electron_1.ipcMain.handle(channel, async (_event, ...args) => {
        try {
            const result = await fn(...args);
            return { success: true, data: result };
        }
        catch (err) {
            console.error(`[IPC ${channel}] Error:`, err.message);
            return { success: false, error: err.message };
        }
    });
}
// Auth
handleDb('auth:login', (username, password) => db.loginUser(username, password));
handleDb('auth:register', (payload) => db.registerUser(payload));
handleDb('auth:changePassword', (username, old, next) => db.changePassword(username, old, next));
handleDb('auth:recover', (username, answer, newPw) => db.recoverUser(username, answer, newPw));
// Clients
handleDb('clients:list', () => db.getClients());
handleDb('clients:get', (id) => db.getClientById(id));
handleDb('clients:create', (data) => db.addClient(data));
handleDb('clients:update', (id, data) => db.updateClient(id, data));
handleDb('clients:delete', (id) => db.deleteClient(id));
handleDb('clients:stats', (id) => db.getClientStats(id));
handleDb('clients:risk', (id) => db.calculateClientRisk(id));
handleDb('clients:activity', (id, limit) => db.getClientActivity(id, limit));
handleDb('clients:kyc', (id, status, notes) => db.updateKycStatus(id, status, notes));
handleDb('clients:blacklist', (id, bl, reason) => db.setClientBlacklist(id, bl, reason));
// Loans
handleDb('loans:list', () => db.getLoans());
handleDb('loans:get', (id) => db.getLoanDetails(id));
handleDb('loans:create', (data) => db.createLoanWithSchedule(data));
handleDb('loans:update', (id, data) => db.updateLoan(id, data));
handleDb('loans:delete', (id) => db.deleteLoan(id));
handleDb('loans:installments', (id) => db.getLoanInstallments(id));
handleDb('loans:payments', (id) => db.getPaymentsByLoan(id));
handleDb('loans:summary', (id) => db.getLoanSummary(id));
handleDb('loans:recalculate', (id) => db.recalculateLoanStatus(id));
handleDb('loans:assessDefault', (id) => db.assessDefault(id));
handleDb('loans:earlySettlement', (id) => db.calculateEarlySettlement(id));
handleDb('loans:earlySettle', (id, data) => db.earlySettleLoan(id, data));
handleDb('loans:overdue', () => db.getOverdueInstallments());
handleDb('loans:upcoming', (days) => db.getUpcomingInstallments(days));
handleDb('loans:byClient', (clientId) => db.getLoansByClient(clientId));
// Payments
handleDb('payments:list', () => db.getAllPayments());
handleDb('payments:add', (data) => db.allocatePayment(data));
handleDb('payments:reverse', (id, reason, by) => db.reversePayment(id, reason, by));
handleDb('payments:stats', (period) => db.getPaymentStats(period));
handleDb('payments:pipeline', (days) => db.getPaymentPipeline(days));
handleDb('payments:profit', (start, end) => db.getProfitAnalysis(start, end));
handleDb('payments:trends', () => db.getCollectionTrends());
handleDb('payments:chartData', (period, groupBy) => db.getPaymentChartData(period, groupBy));
// Penalties
handleDb('penalties:list', () => db.getAllPenalties());
handleDb('penalties:add', (data) => db.addPenalty(data));
handleDb('penalties:updateStatus', (id, status) => db.updatePenaltyStatus(id, status));
handleDb('penalties:delete', (id) => db.deletePenalty(id));
handleDb('penalties:applyAuto', () => db.applyAutoPenalties());
// Collateral
handleDb('collateral:list', () => db.getAllCollateral());
handleDb('collateral:byLoan', (loanId) => db.getCollateralByLoan(loanId));
handleDb('collateral:byClient', (clientId) => db.getCollateralByClient(clientId));
handleDb('collateral:add', (data) => db.addCollateral(data));
handleDb('collateral:update', (id, data) => db.updateCollateral(id, data));
handleDb('collateral:delete', (id) => db.deleteCollateral(id));
handleDb('collateral:forfeit', (id) => db.forfeitCollateral(id));
// Documents
handleDb('docs:clientList', (clientId) => db.getClientDocuments(clientId));
handleDb('docs:clientAdd', (data) => db.addClientDocument(data));
handleDb('docs:clientDelete', (id) => db.deleteClientDocument(id));
handleDb('docs:companyList', () => db.getCompanyDocuments());
handleDb('docs:companyAdd', (data) => db.addCompanyDocument(data));
handleDb('docs:companyDelete', (id) => db.deleteCompanyDocument(id));
// Accounts
handleDb('accounts:list', () => db.getAccounts());
handleDb('accounts:add', (data) => db.addAccount(data));
handleDb('accounts:update', (id, data) => db.updateAccount(id, data));
handleDb('accounts:delete', (id) => db.deleteAccount(id));
handleDb('accounts:transactions', (limit) => db.getTransactions(limit));
handleDb('accounts:addTransaction', (data) => db.addTransaction(data));
handleDb('accounts:balanceSheets', () => db.getBalanceSheets());
handleDb('accounts:generateBS', (period) => db.generateBalanceSheet(period));
// Audit
handleDb('audit:list', (limit) => db.getAuditLog(limit));
handleDb('audit:clear', () => db.clearAuditLog());
handleDb('audit:delete', (id) => db.deleteAuditEntry(id));
// Settings
handleDb('settings:get', (key) => db.getSetting(key));
handleDb('settings:set', (key, value) => db.setSetting(key, value));
// Users
handleDb('users:list', () => db.getAllUsers());
handleDb('users:updateRole', (id, role, perms) => db.updateUserRole(id, role, perms));
handleDb('users:toggleStatus', (id, isActive) => db.toggleUserStatus(id, isActive));
handleDb('users:delete', (id) => db.deleteUser(id));
// Reports
handleDb('reports:batchAssessment', () => db.runBatchAssessment());
// Backups
handleDb('backups:list', () => db.getBackups());
handleDb('backups:create', (type) => db.createBackup(type));
handleDb('backups:restore', (id) => db.restoreBackup(id));
handleDb('backups:delete', (id) => db.deleteBackup(id));
// Native dialogs
electron_1.ipcMain.handle('dialog:openFile', async (_event, options) => {
    if (!mainWindow)
        return null;
    const result = await electron_1.dialog.showOpenDialog(mainWindow, options);
    return result.canceled ? null : result.filePaths[0];
});
electron_1.ipcMain.handle('dialog:saveFile', async (_event, options) => {
    if (!mainWindow)
        return null;
    const result = await electron_1.dialog.showSaveDialog(mainWindow, options);
    return result.canceled ? null : result.filePath;
});
electron_1.ipcMain.handle('shell:openPath', async (_event, filePath) => {
    await electron_1.shell.openPath(filePath);
});
const syncQueue = [];
electron_1.ipcMain.handle('sync:enqueue', (_event, item) => {
    syncQueue.push({ ...item, retries: 0 });
    return { success: true, queueLength: syncQueue.length };
});
electron_1.ipcMain.handle('sync:getQueue', () => {
    return { success: true, data: syncQueue, count: syncQueue.length };
});
electron_1.ipcMain.handle('sync:clearQueue', () => {
    syncQueue.length = 0;
    return { success: true };
});
electron_1.ipcMain.handle('sync:removeItem', (_event, id) => {
    const idx = syncQueue.findIndex(i => i.id === id);
    if (idx !== -1)
        syncQueue.splice(idx, 1);
    return { success: true };
});
// App info
electron_1.ipcMain.handle('app:getVersion', () => electron_1.app.getVersion());
electron_1.ipcMain.handle('app:getUserDataPath', () => userDataPath);
electron_1.ipcMain.handle('app:quit', () => electron_1.app.quit());
// Suppress unused import warning
void fs_1.default;
