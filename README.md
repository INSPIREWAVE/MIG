# MIG

Finance management software built by Madeit General Dealers (MIG).

## System design module scaffold

This repository now includes a strict starter structure under `/app`:

- `/app/frontend`
  - `/components` reusable React UI components
  - `/pages` page-level views
  - `/layouts` application shell and responsive sidebar layout
  - `/hooks` shared frontend hooks
  - `/store` theme system (`emerald`, `sapphire`, etc.)
  - `/services` API endpoint registry
- `/app/backend`
  - `/controllers`
  - `/routes`
  - `/services`
  - `/models`
  - `/middleware`
- `/app/shared`
  - `/types`
  - `/utils`
- `/app/electron` offline app integration placeholder

## Coverage of requested capabilities

- Core modules represented in backend catalog and service scaffolds:
  - Client Management
  - Loan Engine
  - Payments
  - Collateral
  - Accounts/Ledger
  - Reports/Analytics
- Advanced modules represented with scaffolds:
  - Audit log tracking support
  - Notifications endpoint placeholder
  - RBAC middleware
  - Backup/restore placeholder (to be implemented)
  - Document management placeholder (to be implemented)
- SaaS-ready stubs:
  - Multi-user and client portal API-ready frontend/backend split
  - Loan request/approval and payment-tracking-ready API registry

## UI/UX scaffold

- Reusable React components for:
  - Collapsible sidebar
  - KPI cards
  - Dashboard chart placeholder
  - Sortable/filterable table
  - Step-based form with inline validation
  - Audit log panel with trace tracking
- Theme provider and switcher that preserve the multi-theme approach.
