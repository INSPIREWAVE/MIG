# MIG — Loan Management System

Enterprise-grade loan management platform by MadeIt General Dealers (MIG).  
Runs as a **desktop app** (Electron + SQLite) and scales as a **SaaS platform** (Express API + React).

---

## Architecture

```
/app
├── db.js                     # SQLite engine — all business logic (sql.js, bcryptjs)
├── backend/                  # Express + TypeScript REST API
│   └── src/
│       ├── server.ts         # Entry point (port 4000)
│       ├── db/adapter.ts     # Typed wrapper around db.js
│       ├── middleware/       # auth (JWT), validation, error handler
│       ├── routes/           # 14 route modules
│       ├── controllers/      # Request handlers (all CRUD + business ops)
│       ├── services/auth.ts  # JWT sign/verify, refresh token store
│       └── seed.ts           # Seed: 2 users, 10 clients, loans, payments
├── frontend/                 # Vite + React 18 + TypeScript + TailwindCSS
│   └── src/
│       ├── App.tsx           # BrowserRouter + protected routes
│       ├── layouts/          # AppLayout (collapsible sidebar, header)
│       ├── pages/            # 13 pages (Dashboard, Clients, Loans, Payments…)
│       ├── services/api.ts   # Axios client for all API endpoints
│       └── store/auth.ts     # Zustand auth store (localStorage persisted)
├── electron/                 # Electron offline desktop wrapper
│   └── src/
│       ├── main.ts           # Main process + all IPC handlers
│       ├── preload.ts        # contextBridge → window.electronAPI
│       └── sync-worker.ts    # Offline queue → online server push/pull
└── shared/
    ├── types/index.ts        # Shared TypeScript interfaces
    └── utils/format.ts       # formatCurrency util
```

---

## Modules

| Module | Features |
|---|---|
| Client Management | KYC, risk scoring, credit score, documents, blacklisting |
| Loan Engine | Amortization schedules, installments (monthly/weekly/bullet), FIFO payment allocation |
| Payments | Multi-channel, receipt numbers, reversals, payment promises |
| Penalties | Auto-apply, late fees, waiver, pay-off tracking |
| Collateral | Valuation, tracking, forfeiture → auto-payment |
| Accounts / Ledger | Double-entry transactions, balance sheets |
| Reports | KPI dashboard, payment charts, profit analysis, batch assessment |
| Audit Logs | Full entity trace (actor, action, old/new values, timestamp) |
| RBAC | admin / manager / user / viewer roles enforced at middleware |
| Backup & Restore | Manual snapshots stored in SQLite `backups` table |
| Documents | Client & company file uploads (multer, served via API) |
| Offline-Online Sync | Queue-based with server-wins conflict resolution |

---

## Quick Start

### Prerequisites
- Node.js 18+, npm 9+

### 1. Install dependencies

```bash
# Backend
cd app/backend && npm install && cd ../..

# Frontend
cd app/frontend && npm install && cd ../..
```

### 2. Configure environment

```bash
cp app/backend/.env.example app/backend/.env
```

Edit `app/backend/.env`:
```
JWT_SECRET=<long-random-string>
JWT_REFRESH_SECRET=<different-long-random-string>
PORT=4000
NODE_ENV=development
DB_PATH=./data/migl360.db
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
```

### 3. Seed the database

```bash
cd app/backend
npm run build
node dist/seed.js
```

Creates:
- **Admin**: `admin` / `Admin@2026`
- **Manager**: `manager` / `Manager@2026`
- 10 Zambian clients with full KYC
- Loans with installment schedules, payments, penalties, collateral
- Cash, bank, mobile-money accounts

### 4. Run development

```bash
# Terminal 1 — backend (port 4000)
cd app/backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd app/frontend && npm run dev
```

Open **http://localhost:5173** → login with `admin` / `Admin@2026`.

---

## Production Build

```bash
# Build backend
cd app/backend && npm run build

# Build frontend
cd app/frontend && npm run build

# Start backend
cd app/backend && npm start
```

Serve `app/frontend/dist/` with any static host (Nginx, S3, Vercel…).

---

## Electron Desktop App

```bash
cd app/electron
npm install
npm run build      # tsc → dist/

# Dev (frontend must be running on port 5173)
NODE_ENV=development npm start

# Production (uses app/frontend/dist/)
npm start
```

The desktop app uses the same `db.js` directly via secure IPC (no network required).  
Data stored in OS user-data directory. Sync queue pushes to SaaS server when online.

---

## API Reference

`Authorization: Bearer <access_token>` required on all routes except `/auth/login` and `/auth/recover`.

| Area | Key Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/register`, `/auth/recover`, `/auth/change-password`, `GET /auth/me` |
| Clients | `GET/POST /api/clients`, `GET/PUT/DELETE /api/clients/:id`, `POST /api/clients/:id/kyc`, `POST /api/clients/:id/blacklist` |
| Loans | `GET/POST /api/loans`, `GET/PUT/DELETE /api/loans/:id`, `GET /api/loans/overdue`, `GET /api/loans/upcoming` |
| Installments | `GET /api/loans/:id/installments`, `GET /api/loans/:id/summary`, `POST /api/loans/:id/recalculate`, `GET /api/loans/:id/early-settlement` |
| Payments | `GET/POST /api/payments`, `POST /api/payments/:id/reverse`, `GET /api/payments/stats`, `GET /api/payments/pipeline` |
| Penalties | `GET/POST /api/penalties`, `PUT /api/penalties/:id/status`, `POST /api/penalties/apply-auto` |
| Collateral | `GET/POST /api/collateral`, `POST /api/collateral/:id/forfeit` |
| Accounts | `GET/POST /api/accounts`, `GET/POST /api/accounts/transactions`, `POST /api/accounts/balance-sheets` |
| Documents | `GET/POST /api/documents/client`, `GET/POST /api/documents/company` |
| Reports | `GET /api/reports/dashboard`, `/reports/payment-chart`, `/reports/profit`, `POST /reports/batch-assessment` |
| Audit | `GET/DELETE /api/audit`, `DELETE /api/audit/:id` |
| Backups | `GET/POST /api/backups`, `POST /api/backups/:id/restore`, `DELETE /api/backups/:id` |
| Users | `GET /api/users`, `PUT /api/users/:id/role`, `PUT /api/users/:id/status`, `DELETE /api/users/:id` |
| Sync | `GET /api/sync/status`, `POST /api/sync/push`, `GET /api/sync/pull` |
| Settings | `GET /api/settings/:key`, `POST /api/settings` |

---

## Security

- Passwords: **bcrypt** (10 rounds), legacy SHA-256 auto-migrated on login
- JWT access tokens: **15 min** | Refresh tokens: **7 days** (in-memory revocation)
- All SQL via parameterized queries (sql.js API — no injection risk)
- RBAC enforced at middleware: `requireRole('admin')`, `requireRole('manager', 'admin')`
- Helmet.js security headers on all responses
- File uploads stored outside web root, served via authenticated endpoint

---

## Loan Engine Details

- Loan types: `monthly`, `weekly`, `biweekly`, `bullet`
- Payment allocation: FIFO (oldest installment first)
- Late fees: configurable rate (`late_fee_rate` setting), applied after grace period (`grace_period_days`)
- Early settlement: tiered discount on remaining interest (6m early = 15%, 3m = 10%, 1m = 5%, 1w = 2%)
- Batch assessment: `POST /api/reports/batch-assessment` runs `assessDefault` on all active loans

---

## Offline-Online Sync

1. Offline action → added to `syncQueue` (IPC: `sync:enqueue`)
2. Network reconnect → `pushSyncQueue()` sends queue to `POST /api/sync/push`
3. Server applies **server-wins** conflict strategy (skips if server record is newer)
4. Failed items retried up to **3 times** with retry counter
5. `GET /api/sync/pull?lastSyncAt=<ISO>` returns server delta for client to apply

---

## License

Copyright © 2026 MadeIt General Dealers (MIG). All rights reserved.
