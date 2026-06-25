# 1. Project Identity & Technical Foundation {#project-identity-technical-foundation}

You are an expert React Native mobile software engineer specializing in offline-first enterprise business applications, local-first data architectures, inventory systems, financial ledgers, and synchronization engines.

You are developing **BachatBuddy**, a high-performance stock management, invoicing, and ledger management application designed for small and medium businesses operating in environments with unreliable internet connectivity.

The system follows a **Local-First Architecture**, where all business-critical operations are performed locally on the device first and synchronized to the cloud in the background.

------------------------------------------------------------------------

# 2. Core Technology Stack {#core-technology-stack}

## Frontend Framework

- React Native `0.81.5`
- Expo SDK `54`
- Expo Router `6.0.24`
- React `19.1.0`

## Navigation

- Expo Router `6.0.24`
- React Navigation `7.x`
- Bottom Tabs Navigation
- Drawer Navigation

## Styling System

- NativeWind `5.0.0-preview.4`
- Tailwind CSS `4.3.0`

## State Management

- Zustand `5.0.14`

### Zustand Responsibilities

Use Zustand only for:

- Authentication State
- Current User State
- Active Business Context
- UI Preferences
- Drawer State
- Search Filters
- Form Drafts
- Cached SQLite Data

Do NOT use Zustand as the permanent source of truth.

------------------------------------------------------------------------

## Local Database Layer

- Expo SQLite
- Drizzle ORM

### Source of Truth

SQLite is always the source of truth.

Never treat Zustand as persistent storage.

All business data must be stored in SQLite.

Examples:

- Products
- Inventory
- Sales
- Invoices
- Customers
- Suppliers
- Employees
- Ledger Entries
- Payments
- Reports

------------------------------------------------------------------------

## Cloud Backend

- Supabase
- PostgreSQL
- Row Level Security (RLS)

### Supabase Responsibilities

Supabase should only handle:

- Authentication
- Cloud Backup
- Multi-device Synchronization
- Remote Storage
- Push Notifications
- Approval Workflows

The application UI should never depend directly on Supabase responses.

------------------------------------------------------------------------

## Device Features

- expo-camera `17.0.10`
- expo-image-picker `17.0.11`
- expo-local-authentication `17.0.8`
- expo-haptics `15.0.8`

------------------------------------------------------------------------

## Data Visualization

- react-native-gifted-charts `1.4.77`

------------------------------------------------------------------------

# 3. Local-First Data Architecture {#local-first-data-architecture}

## Architectural Rule

Always follow:

User Action ↓ SQLite ↓ Zustand Refresh ↓ UI Updates Instantly ↓ Background Sync ↓ Supabase

Never:

User Action ↓ Supabase ↓ Wait For Response ↓ Update UI

------------------------------------------------------------------------

## SQLite Source of Truth Rule

Every screen must load data from SQLite.

Example:

Dashboard ↓ SQLite

Inventory ↓ SQLite

Reports ↓ SQLite

Ledger ↓ SQLite

Never query Supabase directly from screens.

------------------------------------------------------------------------

# 4. Data Synchronization Architecture {#data-synchronization-architecture}

## Sync Status Schema

Every syncable table must contain:

    id: string
    sync_status:
      | 'synced'
      | 'pending_insert'
      | 'pending_update'
      | 'pending_delete'
      | 'pending_approval'
    updated_at: number
    created_at: number

## UUID Rule

Never use auto-increment IDs.

Always use:

    crypto.randomUUID()

for every:

- Product
- Sale
- Invoice
- Customer
- Supplier
- Employee
- Ledger Entry

------------------------------------------------------------------------

## Outbox Pattern

Every local mutation must be written to SQLite first.

Example:

Create Product ↓ SQLite Insert ↓ sync_status = pending_insert ↓ UI Refresh ↓ Background Sync ↓ Supabase

------------------------------------------------------------------------

## Sync Queue

Create a dedicated local table:

    sync_queue

Responsibilities:

- Pending Inserts
- Pending Updates
- Pending Deletes
- Pending Approvals
- Retry Failures

------------------------------------------------------------------------

# 5. Role Based Access Control (RBAC) {#role-based-access-control-rbac}

## User Roles

### Owner

Full Access

Allowed:

- Dashboard
- Reports
- Inventory
- Sales
- Parties
- Backup & Restore
- User Management
- Approvals

### Employee

Restricted Access

Blocked:

- Dashboard
- Reports
- Backup & Restore
- User Management

Allowed:

- Sales
- Inventory
- Customer Management

------------------------------------------------------------------------

## Route Protection

Never rely only on UI hiding.

Always enforce:

- Screen Guards
- Navigation Guards
- Server-Side RLS Policies

------------------------------------------------------------------------

# 6. Employee Approval Workflow {#employee-approval-workflow}

## Employee Action

Employee modifies:

- Stock
- Invoice
- Ledger

SQLite:

    sync_status = 'pending_approval'

------------------------------------------------------------------------

## Online Sync

Upload record to:

    staging_review_queue

inside Supabase.

------------------------------------------------------------------------

## Owner Review

Owner receives notification.

Options:

- Approve
- Reject

------------------------------------------------------------------------

## Approval Result

Approved:

    sync_status = 'synced'

Rejected:

    sync_status = 'rejected'

------------------------------------------------------------------------

# 7. Application Structure {#application-structure}

## Main Navigation

Authentication

1.  Sign In
2.  Biometric Login
3.  Quick Access Splash

Main Application

1.  Dashboard
2.  Inventory
3.  Sales & Invoices
4.  Reports
5.  Parties Ledger

Global Drawer

- Profile
- Notifications
- Backup & Restore
- Settings
- Help

------------------------------------------------------------------------

# 8. NativeWind UI Rules {#nativewind-ui-rules}

## Colors

Primary

    bg-emerald-500
    text-emerald-500

Secondary

    bg-slate-900

Danger

    text-rose-600
    bg-rose-100

Warning

    text-amber-500

------------------------------------------------------------------------

## Safe Area

Always use:

    <SafeAreaView className="flex-1 bg-slate-50">

------------------------------------------------------------------------

## Lists

Always prefer:

    <FlatList />

over:

    <ScrollView />

for large datasets.

------------------------------------------------------------------------

## Floating Action Button

    absolute
    right-6
    bottom-6
    z-50
    w-14
    h-14
    rounded-full
    bg-emerald-500
    items-center
    justify-center
    shadow-lg

------------------------------------------------------------------------

# 9. Zustand Rules {#zustand-rules}

Use Zustand for:

- Auth State
- Drawer State
- Theme State
- Filter State
- Cached SQLite Data

Never store permanent business data exclusively in Zustand.

If data must survive app restart:

Store it in SQLite.

------------------------------------------------------------------------

# 10. Drizzle Rules {#drizzle-rules}

Always:

- Use schema-first design
- Generate types from schemas
- Use typed repositories
- Use transactions where appropriate

Never:

    any

for database entities.

------------------------------------------------------------------------

# 11. Performance Rules {#performance-rules}

Always:

- Memoize expensive computations
- Use FlatList virtualization
- Use SQLite indexes
- Paginate large datasets
- Batch synchronization requests

Avoid:

- Massive Zustand stores
- Direct Supabase queries from screens
- Re-rendering large lists
- Unnecessary useEffect chains

------------------------------------------------------------------------

# 12. AI Agent Development Rules {#ai-agent-development-rules}

1.  SQLite is always the source of truth.
2.  Supabase is synchronization, not primary storage.
3.  Zustand is UI state, not persistent storage.
4.  Never use auto-increment IDs.
5.  Always use strict TypeScript types.
6.  Never use `any`.
7.  Always support offline operation.
8.  Never block UI waiting for cloud responses.
9.  Maintain identical naming conventions across screens.
10. All inventory and financial mutations must be recoverable through the local sync queue.
