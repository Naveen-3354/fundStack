# FundStack Repository Analysis

## 1) Project Overview

FundStack is a Vite + React + TypeScript admin portal for mutual fund operations. The UI provides modules for dashboard metrics, fund-house discovery, fund record creation, scheme listing, and a simulated bulk data loader.

Core user flows are split between:
- **Server-backed read path** for fund houses (`GET http://localhost:8080/fund-house`).
- **Browser localStorage-backed CRUD path** for mutual funds and schemes.
- **LLM-assisted command console** that parses natural language into create actions.

## 2) High-Level Architecture

### Front-end stack
- React 19 + React Router 7 + Vite 6.
- Tailwind is loaded from CDN in `index.html`.
- No dedicated test framework configured in `package.json`.

### Routing/layout model
- `App.tsx` uses `createBrowserRouter` with a shared shell (`Layout`) and five main routes:
  - Dashboard
  - Fund Houses
  - Mutual Funds
  - Schemes
  - Data Loader

### Data model
- `types.ts` defines domain entities and enums (`MutualFund`, `Scheme`, `FundHouse`, `RiskLevel`, `SchemeType`).

### Data access/service layer
- `services/apiService.ts` centralizes data operations.
- Fund houses use Axios against local backend API.
- Funds/schemes are persisted in localStorage keys:
  - `mf_admin_funds`
  - `mf_admin_schemes`

### Generic table rendering
- `components/DataTable.tsx` provides generic typed table rendering with optional pagination controls and loading placeholders.

## 3) What Is Working Well

1. **Clear separation of responsibilities**
   - Routes/pages, reusable components, and service/data logic are cleanly separated.
2. **Consistent admin UX patterns**
   - Shared DataTable, skeleton loading rows, empty-state messaging, and modal workflow are coherent.
3. **Strong type definitions for domain entities**
   - Enums and interfaces improve maintainability and catch class-of-errors at compile time.
4. **Fast local experimentation**
   - localStorage-driven fund/scheme records make it easy to demo without backend dependencies.

## 4) Key Risks / Gaps

1. **Mixed persistence model can confuse production expectations**
   - Fund houses come from API, while funds/schemes are local-only and browser-specific.
   - This can create data inconsistency across sessions/devices and confusion during QA.

2. **Instruction Console fallback can create orphaned schemes**
   - When fund lookup fails, scheme creation falls back to hardcoded `fundId: '1'`.
   - Since IDs are random strings, this ID may not exist, producing inconsistent relational data.

3. **Pagination display edge case in DataTable**
   - For `total = 0`, range text calculates start as `1` and end as `0`.
   - This can show “Showing 1 to 0 of 0 results.”

4. **Data Loader is UI simulation only**
   - Upload + progress + results are mock behavior; no parsing/validation/persistence pipeline exists.

5. **No automated tests or linting scripts**
   - Current scripts only include `dev`, `build`, `preview`, which increases regression risk.

6. **Runtime dependencies loaded via CDN import map in `index.html`**
   - This is unusual for standard Vite bundling and may create drift between dev/build behavior.

## 5) Recommended Prioritized Improvements

### Priority 1 (correctness)
1. Replace scheme fallback `fundId: '1'` with explicit validation and user-facing error.
2. Normalize data source strategy:
   - either move funds/schemes to backend APIs, or clearly scope the app as demo/offline mode.
3. Fix pagination range text for zero-result datasets.

### Priority 2 (quality gates)
1. Add lint + formatting + unit test setup (e.g., ESLint + Vitest + Testing Library).
2. Add integration tests for `apiService` localStorage behavior and route-level smoke tests.

### Priority 3 (feature completion)
1. Implement actual CSV/JSON ingestion for Data Loader with schema validation.
2. Add delete/update actions for schemes and stronger fund/scheme referential integrity checks.

## 6) Operational Notes

- Build works in current environment (`npm run build`).
- API availability for fund houses is environment-dependent (`localhost:8080`).
- AI instruction processing requires Gemini key wiring through Vite define config.

## 7) Suggested Next Sprint Scope

A practical next sprint could deliver:
1. Referential integrity hardening for scheme creation.
2. Pagination empty-state fix.
3. Basic test harness + CI check for build and tests.
4. Data loader MVP (parse + validate + persist to localStorage/API).

This would materially improve correctness and confidence while preserving current UX momentum.
