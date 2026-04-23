import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  type IpcMainInvokeEvent,
  type OpenDialogOptions,
  type SaveDialogOptions,
} from 'electron';
import path from 'path';
import fs from 'fs';

// DB module (same db.js used by backend)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: Record<string, (...args: any[]) => any> = require('../../db.js');

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.NODE_ENV === 'development';
const userDataPath = app.getPath('userData');

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
  } else {
    await mainWindow.loadFile(
      path.join(__dirname, '../../frontend/dist/index.html')
    );
  }

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', async () => {
  await db.init(userDataPath);
  console.log('[Electron] DB initialized at', userDataPath);
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', async () => {
  if (mainWindow === null) await createWindow();
});

// ============================================================
// IPC HANDLERS — all db operations exposed to renderer
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleDb(channel: string, fn: (...args: any[]) => any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle(channel, async (_event: IpcMainInvokeEvent, ...args: unknown[]) => {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[IPC ${channel}] Error:`, message);
      return { success: false, error: message };
    }
  });
}

// Auth
handleDb('auth:login', (username: string, password: string) => db.loginUser(username, password));
handleDb('auth:register', (payload: any) => db.registerUser(payload));
handleDb('auth:changePassword', (username: string, old: string, next: string) => db.changePassword(username, old, next));
handleDb('auth:recover', (username: string, answer: string, newPw: string) => db.recoverUser(username, answer, newPw));

// Clients
handleDb('clients:list', () => db.getClients());
handleDb('clients:get', (id: number) => db.getClientById(id));
handleDb('clients:create', (data: any) => db.addClient(data));
handleDb('clients:update', (id: number, data: any) => db.updateClient(id, data));
handleDb('clients:delete', (id: number) => db.deleteClient(id));
handleDb('clients:stats', (id: number) => db.getClientStats(id));
handleDb('clients:risk', (id: number) => db.calculateClientRisk(id));
handleDb('clients:activity', (id: number, limit: number) => db.getClientActivity(id, limit));
handleDb('clients:kyc', (id: number, status: string, notes: string) => db.updateKycStatus(id, status, notes));
handleDb('clients:blacklist', (id: number, bl: boolean, reason: string) => db.setClientBlacklist(id, bl, reason));

// Loans
handleDb('loans:list', () => db.getLoans());
handleDb('loans:get', (id: number) => db.getLoanDetails(id));
handleDb('loans:create', (data: any) => db.createLoanWithSchedule(data));
handleDb('loans:update', (id: number, data: any) => db.updateLoan(id, data));
handleDb('loans:delete', (id: number) => db.deleteLoan(id));
handleDb('loans:installments', (id: number) => db.getLoanInstallments(id));
handleDb('loans:payments', (id: number) => db.getPaymentsByLoan(id));
handleDb('loans:summary', (id: number) => db.getLoanSummary(id));
handleDb('loans:recalculate', (id: number) => db.recalculateLoanStatus(id));
handleDb('loans:assessDefault', (id: number) => db.assessDefault(id));
handleDb('loans:earlySettlement', (id: number) => db.calculateEarlySettlement(id));
handleDb('loans:earlySettle', (id: number, data: any) => db.earlySettleLoan(id, data));
handleDb('loans:overdue', () => db.getOverdueInstallments());
handleDb('loans:upcoming', (days: number) => db.getUpcomingInstallments(days));
handleDb('loans:byClient', (clientId: number) => db.getLoansByClient(clientId));

// Payments
handleDb('payments:list', () => db.getAllPayments());
handleDb('payments:add', (data: any) => db.allocatePayment(data));
handleDb('payments:reverse', (id: number, reason: string, by: string) => db.reversePayment(id, reason, by));
handleDb('payments:stats', (period: string) => db.getPaymentStats(period));
handleDb('payments:pipeline', (days: number) => db.getPaymentPipeline(days));
handleDb('payments:profit', (start: string, end: string) => db.getProfitAnalysis(start, end));
handleDb('payments:trends', () => db.getCollectionTrends());
handleDb('payments:chartData', (period: string, groupBy: string) => db.getPaymentChartData(period, groupBy));

// Penalties
handleDb('penalties:list', () => db.getAllPenalties());
handleDb('penalties:add', (data: any) => db.addPenalty(data));
handleDb('penalties:updateStatus', (id: number, status: string) => db.updatePenaltyStatus(id, status));
handleDb('penalties:delete', (id: number) => db.deletePenalty(id));
handleDb('penalties:applyAuto', () => db.applyAutoPenalties());

// Collateral
handleDb('collateral:list', () => db.getAllCollateral());
handleDb('collateral:byLoan', (loanId: number) => db.getCollateralByLoan(loanId));
handleDb('collateral:byClient', (clientId: number) => db.getCollateralByClient(clientId));
handleDb('collateral:add', (data: any) => db.addCollateral(data));
handleDb('collateral:update', (id: number, data: any) => db.updateCollateral(id, data));
handleDb('collateral:delete', (id: number) => db.deleteCollateral(id));
handleDb('collateral:forfeit', (id: number) => db.forfeitCollateral(id));

// Documents
handleDb('docs:clientList', (clientId: number) => db.getClientDocuments(clientId));
handleDb('docs:clientAdd', (data: any) => db.addClientDocument(data));
handleDb('docs:clientDelete', (id: number) => db.deleteClientDocument(id));
handleDb('docs:companyList', () => db.getCompanyDocuments());
handleDb('docs:companyAdd', (data: any) => db.addCompanyDocument(data));
handleDb('docs:companyDelete', (id: number) => db.deleteCompanyDocument(id));

// Accounts
handleDb('accounts:list', () => db.getAccounts());
handleDb('accounts:add', (data: any) => db.addAccount(data));
handleDb('accounts:update', (id: number, data: any) => db.updateAccount(id, data));
handleDb('accounts:delete', (id: number) => db.deleteAccount(id));
handleDb('accounts:transactions', (limit: number) => db.getTransactions(limit));
handleDb('accounts:addTransaction', (data: any) => db.addTransaction(data));
handleDb('accounts:balanceSheets', () => db.getBalanceSheets());
handleDb('accounts:generateBS', (period: string) => db.generateBalanceSheet(period));

// Audit
handleDb('audit:list', (limit: number) => db.getAuditLog(limit));
handleDb('audit:clear', () => db.clearAuditLog());
handleDb('audit:delete', (id: number) => db.deleteAuditEntry(id));

// Settings
handleDb('settings:get', (key: string) => db.getSetting(key));
handleDb('settings:set', (key: string, value: string) => db.setSetting(key, value));

// Users
handleDb('users:list', () => db.getAllUsers());
handleDb('users:updateRole', (id: number, role: string, perms: string) => db.updateUserRole(id, role, perms));
handleDb('users:toggleStatus', (id: number, isActive: boolean) => db.toggleUserStatus(id, isActive));
handleDb('users:delete', (id: number) => db.deleteUser(id));

// Reports
handleDb('reports:batchAssessment', () => db.runBatchAssessment());

// Backups
handleDb('backups:list', () => db.getBackups());
handleDb('backups:create', (type: string) => db.createBackup(type));
handleDb('backups:restore', (id: number) => db.restoreBackup(id));
handleDb('backups:delete', (id: number) => db.deleteBackup(id));

// Native dialogs
ipcMain.handle('dialog:openFile', async (_event: IpcMainInvokeEvent, options: OpenDialogOptions) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:saveFile', async (_event: IpcMainInvokeEvent, options: SaveDialogOptions) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('shell:openPath', async (_event: IpcMainInvokeEvent, filePath: string) => {
  await shell.openPath(filePath);
});

// Sync queue
interface SyncQueueItem {
  id: string;
  entityType: string;
  operation: string;
  payload: Record<string, unknown>;
  clientTimestamp: string;
  retries: number;
}
const syncQueue: SyncQueueItem[] = [];

ipcMain.handle('sync:enqueue', (_event: IpcMainInvokeEvent, item: Omit<SyncQueueItem, 'retries'>) => {
  syncQueue.push({ ...item, retries: 0 });
  return { success: true, queueLength: syncQueue.length };
});

ipcMain.handle('sync:getQueue', () => {
  return { success: true, data: syncQueue, count: syncQueue.length };
});

ipcMain.handle('sync:clearQueue', () => {
  syncQueue.length = 0;
  return { success: true };
});

ipcMain.handle('sync:removeItem', (_event: IpcMainInvokeEvent, id: string) => {
  const idx = syncQueue.findIndex(i => i.id === id);
  if (idx !== -1) syncQueue.splice(idx, 1);
  return { success: true };
});

// App info
ipcMain.handle('app:getVersion', () => app.getVersion());
ipcMain.handle('app:getUserDataPath', () => userDataPath);
ipcMain.handle('app:quit', () => app.quit());

// Suppress unused import warning
void fs;
