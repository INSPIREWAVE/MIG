"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbModule = require('../../../db.js');
const DB_DATA_PATH = process.env.DB_PATH
    ? path_1.default.dirname(path_1.default.resolve(process.env.DB_PATH))
    : path_1.default.join(process.cwd(), 'data');
const clients = [
    {
        name: 'Mwamba Chanda',
        phone: '0977123456',
        nrc: '123456/78/1',
        email: 'mwamba.chanda@email.zm',
        gender: 'Male',
        dateOfBirth: '1985-03-15',
        address: 'Plot 45, Kabulonga, Lusaka',
        occupation: 'Civil Engineer',
        employer: 'Zambia National Building Society',
        monthlyIncome: 12000,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Thandiwe Mulenga',
        phone: '0966234567',
        nrc: '234567/89/2',
        email: 'thandiwe.mulenga@email.zm',
        gender: 'Female',
        dateOfBirth: '1990-07-22',
        address: 'House 12, Northmead, Lusaka',
        occupation: 'Accountant',
        employer: 'Zambia Revenue Authority',
        monthlyIncome: 9500,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Bwalya Kapata',
        phone: '0955345678',
        nrc: '345678/90/3',
        email: 'bwalya.kapata@email.zm',
        gender: 'Male',
        dateOfBirth: '1978-11-05',
        address: 'Stand 78, Chawama, Lusaka',
        occupation: 'Teacher',
        employer: 'Ministry of Education',
        monthlyIncome: 5500,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Mutale Chipimo',
        phone: '0971456789',
        nrc: '456789/01/4',
        email: 'mutale.chipimo@email.zm',
        gender: 'Male',
        dateOfBirth: '1982-06-18',
        address: 'Plot 22, Ibex Hill, Lusaka',
        occupation: 'Nurse',
        employer: 'University Teaching Hospital',
        monthlyIncome: 7200,
        kycStatus: 'pending',
        clientStatus: 'active',
    },
    {
        name: 'Chisomo Phiri',
        phone: '0968567890',
        nrc: '567890/12/5',
        email: 'chisomo.phiri@email.zm',
        gender: 'Female',
        dateOfBirth: '1994-02-28',
        address: 'House 33, Roma, Lusaka',
        occupation: 'Pharmacist',
        employer: 'Lusaka Central Hospital',
        monthlyIncome: 8800,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Kangwa Mwansa',
        phone: '0976678901',
        nrc: '678901/23/6',
        email: 'kangwa.mwansa@email.zm',
        gender: 'Male',
        dateOfBirth: '1975-09-12',
        address: 'Plot 5, Woodlands, Lusaka',
        occupation: 'Businessman',
        employer: 'Self Employed',
        monthlyIncome: 25000,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Namukolo Sianga',
        phone: '0957789012',
        nrc: '789012/34/7',
        email: 'namukolo.sianga@email.zm',
        gender: 'Female',
        dateOfBirth: '1988-12-03',
        address: 'Stand 101, Chelston, Lusaka',
        occupation: 'Lawyer',
        employer: 'Sianga & Associates',
        monthlyIncome: 18000,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Lubasi Nkumbula',
        phone: '0964890123',
        nrc: '890123/45/8',
        email: 'lubasi.nkumbula@email.zm',
        gender: 'Male',
        dateOfBirth: '1980-04-25',
        address: 'House 67, Kalingalinga, Lusaka',
        occupation: 'Driver',
        employer: 'Zambia Postal Services',
        monthlyIncome: 3800,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Fridah Tembo',
        phone: '0978901234',
        nrc: '901234/56/9',
        email: 'fridah.tembo@email.zm',
        gender: 'Female',
        dateOfBirth: '1992-08-14',
        address: 'Plot 88, Avondale, Lusaka',
        occupation: 'Marketing Officer',
        employer: 'Zambeef Products PLC',
        monthlyIncome: 7600,
        kycStatus: 'verified',
        clientStatus: 'active',
    },
    {
        name: 'Chipasha Mwenya',
        phone: '0963012345',
        nrc: '012345/67/0',
        email: 'chipasha.mwenya@email.zm',
        gender: 'Male',
        dateOfBirth: '1986-01-30',
        address: 'Stand 200, Matero, Lusaka',
        occupation: 'Mechanic',
        employer: 'Toyota Zambia Ltd',
        monthlyIncome: 6000,
        kycStatus: 'pending',
        clientStatus: 'active',
    },
];
async function seed() {
    console.log('[Seed] Initializing database...');
    await dbModule.initDB(DB_DATA_PATH);
    console.log(`[Seed] Database ready at ${DB_DATA_PATH}`);
    // Register users
    console.log('[Seed] Registering users...');
    const adminResult = await dbModule.registerUser('admin', 'Admin@2026', 'admin', 'What is your mother\'s maiden name?', 'Chanda');
    if (adminResult.success) {
        console.log('[Seed] Admin user created');
        await dbModule.updateUserRole(adminResult.id, 'admin', 'all');
    }
    else {
        console.log('[Seed] Admin user already exists or error:', adminResult.error);
    }
    const managerResult = await dbModule.registerUser('manager', 'Manager@2026', 'manager', 'What city were you born in?', 'Lusaka');
    if (managerResult.success) {
        console.log('[Seed] Manager user created');
        await dbModule.updateUserRole(managerResult.id, 'manager', 'loans,clients,payments,reports');
    }
    else {
        console.log('[Seed] Manager user already exists or error:', managerResult.error);
    }
    // Create accounts
    console.log('[Seed] Creating accounts...');
    await dbModule.addAccount({ accountName: 'Cash on Hand', accountType: 'cash', balance: 50000, isActive: 1 });
    await dbModule.addAccount({ accountName: 'Zanaco Bank Account', accountType: 'bank', accountNumber: '1234567890', provider: 'Zanaco', balance: 500000, isActive: 1 });
    await dbModule.addAccount({ accountName: 'Airtel Money', accountType: 'mobile_money', provider: 'Airtel', balance: 25000, isActive: 1 });
    // Add clients and loans
    console.log('[Seed] Adding clients and loans...');
    const loanTypes = ['monthly', 'weekly', 'bullet'];
    const loanDurations = [6, 12, 3, 24];
    const today = new Date();
    const clientIds = [];
    for (const clientData of clients) {
        const result = await dbModule.addClient(clientData);
        if (result.success) {
            clientIds.push(result.id);
            console.log(`[Seed] Client created: ${clientData.name} (ID: ${result.id})`);
        }
        else {
            console.warn(`[Seed] Failed to create client ${clientData.name}: ${result.error}`);
        }
    }
    const loanIds = [];
    for (let i = 0; i < clientIds.length; i++) {
        const clientId = clientIds[i];
        const loanType = loanTypes[i % loanTypes.length];
        const duration = loanDurations[i % loanDurations.length];
        const amount = [15000, 25000, 8000, 12000, 30000, 50000, 20000, 5000, 18000, 10000][i];
        const interest = [15, 18, 20, 12, 16, 14, 18, 22, 15, 20][i];
        const loanStart = new Date(today);
        loanStart.setMonth(loanStart.getMonth() - Math.floor(Math.random() * 6));
        const loanDate = loanStart.toISOString().slice(0, 10);
        const dueDate = new Date(loanStart);
        dueDate.setMonth(dueDate.getMonth() + duration);
        const loanResult = await dbModule.createLoanWithSchedule({
            clientId,
            amount,
            interest,
            loanDate,
            dueDate: dueDate.toISOString().slice(0, 10),
            loanType,
            duration,
            notes: `Seed loan for client ${clientId}`,
        });
        if (loanResult.success) {
            loanIds.push(loanResult.loanId);
            console.log(`[Seed] Loan created for client ${clientId} (Loan ID: ${loanResult.loanId})`);
            // Add 3-6 payments for first 7 clients
            if (i < 7) {
                const paymentCount = 3 + (i % 4);
                for (let p = 0; p < paymentCount; p++) {
                    const payDate = new Date(loanStart);
                    payDate.setMonth(payDate.getMonth() + p + 1);
                    if (payDate > today)
                        break;
                    const paymentAmount = Math.round((amount * (1 + interest / 100)) / duration);
                    await dbModule.addPaymentEnhanced({
                        loanId: loanResult.loanId,
                        amount: paymentAmount,
                        paymentDate: payDate.toISOString().slice(0, 10),
                        paymentMethod: ['cash', 'bank_transfer', 'mobile_money'][p % 3],
                        notes: `Installment payment ${p + 1}`,
                    });
                }
                console.log(`[Seed] Added payments for loan ${loanResult.loanId}`);
            }
            // Add collateral for first 5 loans
            if (i < 5) {
                const collateralTypes = ['Vehicle', 'Property', 'Electronics', 'Jewelry', 'Land'];
                const descriptions = [
                    'Toyota Corolla 2018, registration ABA 1234',
                    'Residential plot in Woodlands, title deed held',
                    'Samsung 55" Smart TV + Laptop Dell i7',
                    '22-carat gold necklace and bracelet set',
                    '1 hectare farm land, Chisamba area',
                ];
                await dbModule.addCollateral({
                    clientId,
                    loanId: loanResult.loanId,
                    itemType: collateralTypes[i],
                    description: descriptions[i],
                    estimatedValue: amount * 1.5,
                    acceptedValue: amount * 1.2,
                    status: 'active',
                    consentGiven: 1,
                    consentDate: loanDate,
                });
                console.log(`[Seed] Collateral added for loan ${loanResult.loanId}`);
            }
            // Add penalties for loans 7 and 8 (simulate overdue)
            if (i >= 7 && i <= 8) {
                await dbModule.addPenalty({
                    loanId: loanResult.loanId,
                    amount: Math.round(amount * 0.05),
                    reason: 'Late payment penalty - 30 days overdue',
                });
                console.log(`[Seed] Penalty added for loan ${loanResult.loanId}`);
            }
        }
        else {
            console.warn(`[Seed] Failed to create loan for client ${clientId}: ${loanResult.error}`);
        }
    }
    // Log audit entries
    await dbModule.logAudit('SEED_COMPLETE', 'system', null, null, JSON.stringify({ clientCount: clientIds.length, loanCount: loanIds.length }));
    console.log('\n[Seed] ✅ Seeding complete!');
    console.log(`[Seed]   Clients: ${clientIds.length}`);
    console.log(`[Seed]   Loans: ${loanIds.length}`);
    console.log('[Seed]   Users: admin (Admin@2026), manager (Manager@2026)');
    console.log('[Seed]   Accounts: Cash, Zanaco Bank, Airtel Money');
}
seed().catch((err) => {
    console.error('[Seed] Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map