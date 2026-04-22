"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const path_1 = __importDefault(require("path"));
require("dotenv/config");
// db.js is a plain JS module with no TypeScript declarations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbModule = require('../../../db.js');
const DB_PATH = process.env.DB_PATH
    ? path_1.default.dirname(path_1.default.resolve(process.env.DB_PATH))
    : path_1.default.join(process.cwd(), 'data');
function wrap(fnName) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args) => dbModule[fnName](...args);
}
exports.db = {
    init: (userDataPath) => dbModule['initDB'](userDataPath || DB_PATH),
    addClient: wrap('addClient'),
    getClients: wrap('getClients'),
    getClientById: wrap('getClientById'),
    updateClient: wrap('updateClient'),
    deleteClient: wrap('deleteClient'),
    calculateClientRisk: wrap('calculateClientRisk'),
    getClientStats: wrap('getClientStats'),
    addLoan: wrap('addLoan'),
    getLoans: wrap('getLoans'),
    getLoansByClient: wrap('getLoansByClient'),
    getLoanDetails: wrap('getLoanDetails'),
    createLoanWithSchedule: wrap('createLoanWithSchedule'),
    getLoanInstallments: wrap('getLoanInstallments'),
    allocatePayment: wrap('allocatePayment'),
    recalculateLoanStatus: wrap('recalculateLoanStatus'),
    assessDefault: wrap('assessDefault'),
    getLoanSummary: wrap('getLoanSummary'),
    getOverdueInstallments: wrap('getOverdueInstallments'),
    getUpcomingInstallments: wrap('getUpcomingInstallments'),
    calculateEarlySettlement: wrap('calculateEarlySettlement'),
    earlySettleLoan: wrap('earlySettleLoan'),
    addPayment: wrap('addPayment'),
    addPaymentEnhanced: wrap('addPaymentEnhanced'),
    getPaymentsByLoan: wrap('getPaymentsByLoan'),
    getAllPayments: wrap('getAllPayments'),
    reversePayment: wrap('reversePayment'),
    getPaymentStats: wrap('getPaymentStats'),
    getProfitAnalysis: wrap('getProfitAnalysis'),
    getCollectionTrends: wrap('getCollectionTrends'),
    getDailyCollectionReport: wrap('getDailyCollectionReport'),
    getPaymentChartData: wrap('getPaymentChartData'),
    addPenalty: wrap('addPenalty'),
    getPenaltiesByLoan: wrap('getPenaltiesByLoan'),
    getAllPenalties: wrap('getAllPenalties'),
    updatePenaltyStatus: wrap('updatePenaltyStatus'),
    deletePenalty: wrap('deletePenalty'),
    applyAutoPenalties: wrap('applyAutoPenalties'),
    addCollateral: wrap('addCollateral'),
    getCollateralByLoan: wrap('getCollateralByLoan'),
    getCollateralByClient: wrap('getCollateralByClient'),
    getAllCollateral: wrap('getAllCollateral'),
    updateCollateral: wrap('updateCollateral'),
    deleteCollateral: wrap('deleteCollateral'),
    forfeitCollateral: wrap('forfeitCollateral'),
    addClientDocument: wrap('addClientDocument'),
    getClientDocuments: wrap('getClientDocuments'),
    deleteClientDocument: wrap('deleteClientDocument'),
    addCompanyDocument: wrap('addCompanyDocument'),
    getCompanyDocuments: wrap('getCompanyDocuments'),
    addAccount: wrap('addAccount'),
    getAccounts: wrap('getAccounts'),
    updateAccount: wrap('updateAccount'),
    deleteAccount: wrap('deleteAccount'),
    addTransaction: wrap('addTransaction'),
    getTransactions: wrap('getTransactions'),
    createBackup: wrap('createBackup'),
    getBackups: wrap('getBackups'),
    restoreBackup: wrap('restoreBackup'),
    generateBalanceSheet: wrap('generateBalanceSheet'),
    getBalanceSheets: wrap('getBalanceSheets'),
    registerUser: wrap('registerUser'),
    loginUser: wrap('loginUser'),
    recoverUser: wrap('recoverUser'),
    changePassword: wrap('changePassword'),
    getAllUsers: wrap('getAllUsers'),
    updateUserRole: wrap('updateUserRole'),
    toggleUserStatus: wrap('toggleUserStatus'),
    logAudit: wrap('logAudit'),
    getAuditLog: wrap('getAuditLog'),
    clearAuditLog: wrap('clearAuditLog'),
    deleteAuditEntry: wrap('deleteAuditEntry'),
    getClientActivity: wrap('getClientActivity'),
    updateKycStatus: wrap('updateKycStatus'),
    setClientBlacklist: wrap('setClientBlacklist'),
    updateLoan: wrap('updateLoan'),
    deleteLoan: wrap('deleteLoan'),
    deleteCompanyDocument: wrap('deleteCompanyDocument'),
    deleteBackup: wrap('deleteBackup'),
    deleteUser: wrap('deleteUser'),
    getSetting: wrap('getSetting'),
    setSetting: wrap('setSetting'),
    runBatchAssessment: wrap('runBatchAssessment'),
    syncClientLoanData: wrap('syncClientLoanData'),
    getPaymentPipeline: wrap('getPaymentPipeline'),
    validateLicense: wrap('validateLicense'),
    getMachineId: wrap('getMachineId'),
    resetDatabase: wrap('resetDatabase'),
};
//# sourceMappingURL=adapter.js.map