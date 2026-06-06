# AGENT.md

## 1. Project Identity & Technical Foundation
You are an expert mobile software engineer specializing in offline-first enterprise data architectures. You are developing **BachatBuddy**, a high-performance, local-first stock and ledger management application built with performance, security, and absolute structural data safety at its core.

### Core Stack Specification
* **Frontend Framework:** React Native (Expo Managed Workflow / SDK 51+)
* **Styling Engine:** NativeWind v4 (Tailwind CSS utility engine mapped for Native runtimes)
* **Local Storage Engine:** Expo SQLite (`expo-sqlite`) + Drizzle ORM for type-safe relational schemas
* **Cloud Core & Authentication:** Supabase (PostgreSQL engine utilizing Row-Level Security)
* **State & Cache Optimization:** TanStack Query v5 (`@tanstack/react-query`) for optimistic local UI syncs
* **Network Ingestion:** `@react-native-community/netinfo` for real-time connection telemetry

---

## 2. App Structure & Tab Routing
The application layout follows a strict role-based presentation split governed by the initial login payload.

### Primary Screen Hierarchy & Index
* **Authentication Hub:** `1.0 Sign In (Password)`, `1.1 Biometric/Touch ID Binder`, `1.2 Quick Touch Splash`
* **System Navigation:** Global Sidebar Drawer Menu (`3.1`) + Persistent 5-Tab Footer Bar:
    1.  **Home / Dashboard (`3.0`):** Operational summaries, KPI grids, Quick Action workflows, and Quick Report entry points.
    2.  **Stock / Inventory (`4.0`):** Complete stock directory, search indexing, item modals, `4.3 Add Product Option Picker` (Manual form vs. `expo-camera` barcode scanning).
    3.  **Sale / Invoicing (`5.0`):** Historic sales records, advanced filtering, full transactional checkout constructor (`5.3 Invoice Add`), print/share previews (`5.2.6`).
    4.  **Reports / Analytics (`6.0`):** Operational business intelligence dashboard. 3-Tab internal navigation tracking *Sales*, *Stock velocity*, and *Parties performance maps*.
    5.  **Parties Ledger (`7.0`):** Stakeholder directories divided via internal sub-tabs tracking *Customers*, *Suppliers*, and *Employees*.

---

## 3. Strict Security & Role-Based Access Control (RBAC)
The application enforces strict conditional rendering and structural route protections depending on user roles (`Owner` vs. `Employee`).

### Role Permissions Matrix

| Feature Module | Owner Permissions | Employee Permissions | Architectural Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **Dashboard (`3.0`)** | Full Access | **BLOCKED** | Route guarding via Auth State evaluation; hide tab entry. |
| **Reports Engine (`6.0`)**| Full Access | **BLOCKED** | Block navigation attempts; completely omit UI elements. |
| **Backup & Restore (`3.1.4`)**| Full Access | **BLOCKED** | Disable interactive components; hide menu item. |
| **Data Synchronization** | Instant / Direct | **REQUIRES APPROVAL**| Outbox record insertion pattern via local Sync Queue table. |
| **Stock & Party Mutators**| Direct Save | Direct Local Save | Written locally to SQLite; status flagged based on active profile. |

---

## 4. Offline-First Architecture & Data Sync Blueprint
To maintain operation in locations with erratic internet connectivity, **BachatBuddy operates completely offline-first**. 

### Local Data Modeling (Drizzle Schema Blueprint)
All core entities require an tracking flag array to safely monitor synchronization cycles across local and remote engines:
* `id`: Primary key text uuid (generated locally on the device to prevent sequencing collisions online).
* `sync_status`: String Enum matching `['synced', 'pending_insert', 'pending_update', 'pending_approval']`.
* `updated_at`: Integer millisecond timestamp marking mutations.

### The Offline Outbox Pattern Lifecycle
[User Action: Create Invoice]
│
▼
┌───────────┐
│ Local DB  │ ──► Immediately updates SQLite (App feels instant & lag-free)
└─────┬─────┘
│
▼
┌───────────┐
│ NetInfo   │ ──► Evaluates active internet connection state
└─────┬─────┘
│
├─► [OFFLINE] ──► Retains 'pending_X' flags inside local database engine
│
└─► [ONLINE]  ──► Triggers background sync via TanStack Query to remote tables

### Employee Mutation & Owner Approval Workflow
1.  When an **Employee** modifies stock or signs a new Invoice, the local row is written with `sync_status = 'pending_approval'`.
2.  If an active internet connection is detected, the row is copied down to a remote Supabase staging collection named `staging_review_queue`.
3.  The **Owner** receives an operational alert via the Notifications screen (`3.2`).
4.  Upon Owner approval, an isolated Postgres remote function updates the production database tables and issues a socket notification pushing the data down to the app's SQLite instance, changing the item state to `synced`.

---

## 5. UI & UX Development System Guidelines (NativeWind)
Maintain high fidelity with the shared visual mockups by consistently utilizing these NativeWind UI rules:

* **Color Theme Logic:** * Primary Accent (Brand Green): `bg-emerald-500` / `text-emerald-500`
    * Secondary Deep Tone (Headers/Nav): `bg-slate-900` / `bg-gradient-to-b from-emerald-500 to-slate-950`
    * System Warnings (Low Stock / Overdue Debt): `text-amber-500` / `bg-rose-100 text-rose-600`
* **Layout Safety Rules:** Always wrap core views within clean `<SafeAreaView className="flex-1 bg-slate-50">` components to ensure cross-platform layout stability across modern iOS and Android screen notches.
* **Lists Optimization:** For heavy views (like the 63-screen layout variations containing long item list components), always use `<FlatList>` instead of mapping single `<ScrollView>` wrappers to avoid memory overhead leaks on old mobile devices.
* **Action Floating Actions:** Keep the floating create actions (`+`) standard: fixed positioning inside the root container element (`absolute right-6 bottom-6 z-50 rounded-full w-14 h-14 bg-emerald-500 items-center justify-center shadow-lg`).

---

## 6. AI Agent Execution Directives (Strict Operational Rules)
When writing code for this repository, you must obey these rules without exception:
1.  **Never Assume Connection Status:** Every network data request must be wrapped inside an offline fallback check using TanStack Query's `networkMode: 'offlineFirst'`.
2.  **Enforce Absolute Type Safety:** Always reference types compiled from the local Drizzle schema declarations. Never use arbitrary `any` typings for entities like transactions, stock lists, or user properties.
3.  **Strict ID Verification Rule:** Never let the local SQLite database create auto-incrementing integer IDs (`1, 2, 3...`). Always generate a safe string UUID via `crypto.randomUUID()` on the device client to guarantee that local IDs do not collide when backing up or uploading to the shared cloud.
4.  **No Structural Breaks:** When writing deep screen features (such as invoice customization or complex multi-parameter filter arrays), maintain identical variable naming conventions to prevent breaks across screens.