export type ModuleCatalog = {
  core: string[];
  advanced: string[];
  saas: string[];
};

export const moduleCatalog: ModuleCatalog = {
  core: [
    'Client Management (KYC, risk scoring, documents)',
    'Loan Engine (interest, installments, penalties, restructuring)',
    'Payments System (multi-channel, receipts, reversals)',
    'Collateral System (valuation, tracking, forfeiture)',
    'Accounts / Ledger (double-entry system)',
    'Reports & Analytics (real-time dashboards)'
  ],
  advanced: [
    'Audit Logs (UI + tracking)',
    'Notifications (due dates, defaults)',
    'Role-Based Access Control',
    'Backup & Restore system',
    'Document management (uploads, previews, downloads)'
  ],
  saas: [
    'Multi-user accounts',
    'Client login portal',
    'Loan requests & approvals',
    'Payment tracking (mobile/web)',
    'API-ready for mobile app'
  ]
};
