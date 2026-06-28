# Project Overview

- Project name: BachatBuddy
- Purpose: Local-first stock management, invoicing, reporting, party ledger, backup, and business profile app for small and medium businesses.
- Current development stage: Frontend mostly implemented; backend/local-first foundation in progress.
- Tech stack: React Native 0.81.5, Expo SDK 54, Expo Router 6, React 19, NativeWind 5 preview, Tailwind CSS 4, Zustand 5, Expo SQLite, Drizzle ORM, Supabase, react-native-gifted-charts.
- Main architecture: Local-first. User actions should write to SQLite first, refresh UI state from local data, then sync to Supabase in the background.

# Folder Structure

- `app/`: Expo Router screens, route groups, app layouts, auth routes, app routes, and modal routes.
- `app/(auth)/`: Public authentication and recovery screens.
- `app/(app)/`: Protected main app screens for dashboard, stock, sales, reports, and parties.
- `app/(modal)/`: Modal flows for profile, notifications, backup/restore, business profile, export, smart login, invoice customization, logout, and password changes.
- `src/components/`: Reusable UI, layout, auth, dashboard, report, modal, menu, notification, and invoice components.
- `src/db/`: Local SQLite client, Drizzle schema, manual migrations, and repositories.
- `src/services/`: Auth, session, profile, invoice PDF/viewer, and user profile mapping services.
- `src/store/`: Zustand stores and local secure storage helpers.
- `src/hooks/`: Session, drawer, and auth workflow hooks.
- `src/lib/`: Supabase client, secure storage helper, and sample data.
- `src/types/`: App, auth, and invoice TypeScript types.
- `src/constants/`: Routes, icons, theme, chart constants, and default data.
- `src/Utility/`: Report, chart, filtering, date, and ranking helpers.
- `assets/`: Images, icons, and fonts.
- `design/`: Reference UI screenshots.
- `supabase/`: Supabase project folder placeholder; no committed migrations currently present.

# Features

## Authentication

Status: In Progress

Description:
Auth screens are implemented. Supabase Auth is used for sign-up, sign-in, OTP, password reset, sign-out, and session refresh. Local session/profile persistence exists through SQLite. Profile creation now writes to SQLite and `sync_queue` first, then attempts Supabase profile insertion.

Main Files:
- `app/(auth)`
- `src/hooks/auth/useAuth.ts`
- `src/services/auth/authService.ts`
- `src/services/sessionService.ts`
- `src/services/profileService.ts`
- `src/store/authStore.ts`
- `src/db/repositories/sessionRepository.ts`
- `src/db/repositories/usersRepository.ts`

## Biometric Login

Status: In Progress

Description:
Biometric credential storage and authentication are implemented through Expo Local Authentication and SecureStore. Tokens and expiry are stored for biometric re-auth; passwords are not stored. Biometric sign-in now restores an active local session first, or rebuilds the Supabase/local SQLite session from saved biometric tokens when needed.

Main Files:
- `app/(auth)/fingerprint.tsx`
- `app/(auth)/manage-fingerprint.tsx`
- `app/(modal)/smart_login`
- `src/hooks/auth/useAuth.ts`
- `src/services/sessionService.ts`
- `src/store/biometricStore.ts`
- `src/lib/secureStorage.ts`

## Navigation And Route Guards

Status: In Progress

Description:
Expo Router groups are set up for auth, protected app screens, and modals. `AuthGuard` restores local session state and blocks unauthenticated app access. Employee dashboard/report blocking exists in navigation guard logic.

Main Files:
- `app/_layout.tsx`
- `app/(auth)/_layout.tsx`
- `app/(app)/_layout.tsx`
- `app/(modal)/_layout.tsx`
- `src/components/auth/AuthGuard.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/DrawerMenu.tsx`

## Dashboard

Status: Completed

Description:
Dashboard UI exists with stats, quick cards, section headers, and summary cards. Data currently appears frontend/sample-data oriented rather than fully SQLite-backed.

Main Files:
- `app/(app)/dashboard/index.tsx`
- `src/components/dashboard`
- `src/lib/sampleData.ts`

## Inventory / Stock

Status: In Progress

Description:
Stock list, details, add, edit, supplier add, and filter screens exist. Product repository supports local-first create/update/pending-delete with sync queue writes.

Main Files:
- `app/(app)/stock`
- `src/db/repositories/productsRepository.ts`
- `src/components/common/ListItemCard.tsx`
- `src/components/modal/FilterModal.tsx`

## Sales And Invoices

Status: In Progress

Description:
Invoice list, add, edit, detail, product/customer/subtotal editing, and filtering screens exist. Invoice PDF and invoice viewer services exist. Local-first invoice repositories are not yet implemented.

Main Files:
- `app/(app)/sale`
- `src/services/invoice/pdfService.ts`
- `src/services/invoice/invoiceViewer.tsx`
- `src/templates/invoiceTemplate.ts`
- `src/templates/mockInvoiceData.ts`
- `src/components/ui/InvoiceItemCard.tsx`
- `src/components/ui/InvoiceItemProductCard.tsx`

## Reports

Status: In Progress

Description:
Report screens and chart components exist for stock, sales, and party reports. Reports currently rely on local utilities/sample data patterns, not a complete SQLite reporting layer.

Main Files:
- `app/(app)/reports`
- `src/components/report`
- `src/Utility`
- `react-native-gifted-charts`

## Parties / Ledger

Status: In Progress

Description:
Customer, supplier, employee, party detail, add, and filter screens exist. SQLite schema has customers and suppliers but no completed local-first repositories for customers, suppliers, employees, ledger entries, or payments.

Main Files:
- `app/(app)/parties`
- `src/db/schema.ts`
- `src/components/common/ListItemCard.tsx`

## Profile And Business Profile

Status: In Progress

Description:
Profile and business profile modals exist. Profile updates now write to SQLite first and enqueue sync work, with a best-effort Supabase update.

Main Files:
- `app/(modal)/profile`
- `app/(modal)/business_profile`
- `src/services/profileService.ts`
- `src/db/repositories/usersRepository.ts`

## Backup And Restore

Status: Planned

Description:
Backup/restore screens exist, but the backend backup, restore, conflict handling, and Supabase storage flows are not implemented.

Main Files:
- `app/(modal)/backup_restore`

## Invoice Customization

Status: In Progress

Description:
Invoice customization, template, color, options, and signature pad screens exist. Zustand store exists for customization state.

Main Files:
- `app/(modal)/customize_invoice`
- `src/store/invoiceCustomizationStore.ts`
- `src/templates/invoiceTemplate.ts`

## Export / Invite / Notifications / Change Password

Status: In Progress

Description:
Screens exist for export, invite friend, notifications, notification options, and change password. Backend integrations are incomplete or partial.

Main Files:
- `app/(modal)/export`
- `app/(modal)/invite_friend`
- `app/(modal)/notification`
- `app/(modal)/change_password`

## Sync Engine

Status: Planned

Description:
The `sync_queue` table and repository exist. A background processor that pushes queued mutations, handles retries, approvals, deletes, and marks records synced is not yet implemented.

Main Files:
- `src/db/repositories/syncQueueRepository.ts`
- `src/db/schema.ts`

# Database

- Local database: Expo SQLite database named `bachatbuddy.db`.
- ORM: Drizzle ORM with schema in `src/db/schema.ts`.
- Cloud database: Supabase PostgreSQL, intended for auth, backup, sync, remote storage, notifications, and approvals.
- Existing local tables: `users`, `auth_sessions`, `customers`, `suppliers`, `products`, `invoices`, `invoice_items`, `sync_queue`.
- Existing sync statuses: `synced`, `pending_insert`, `pending_update`, `pending_delete`, `pending_approval`, `rejected`.
- Existing queue operations: `insert`, `update`, `delete`, `approval_request`.
- Relationships:
  - `auth_sessions.user_id -> users.id`
  - `customers.created_by_id` and `last_updated_by_id -> users.id`
  - `suppliers.created_by_id` and `last_updated_by_id -> users.id`
  - `products.created_by_id`, `last_updated_by_id -> users.id`
  - `products.supplier_id -> suppliers.id`
  - `invoices.customer_id -> customers.id`
  - `invoice_items.invoice_id -> invoices.id`
  - `invoice_items.product_id -> products.id`
- Migration status: Manual SQL migration exists in `src/db/migrations.ts`; no generated Drizzle migration files are committed for the current schema.
- Missing local tables: employees, ledger entries, payments, staging approval mirror, backup metadata, and sync conflict metadata.

# State Management

- `src/store/authStore.ts`: Auth session, current user, role, loading state, biometric flag, and RBAC helper methods. Zustand only; SQLite stores durable session/profile data.
- `src/store/biometricStore.ts`: Biometric enable/check/authenticate workflow using secure storage and Expo Local Authentication.
- `src/store/invoiceCustomizationStore.ts`: Invoice customization UI/template options.
- `src/store/secureStorage.ts`: Secure storage key definitions/helper area.
- Persistence strategy: Durable business/auth data should live in SQLite or SecureStore where appropriate. Zustand is runtime state/cache only.

# Navigation

- Router: Expo Router.
- Public routes: `app/(auth)` and splash/index routing.
- Protected routes: `app/(app)` guarded by `src/components/auth/AuthGuard.tsx`.
- Main protected sections: dashboard, stock, sale, reports, parties.
- Modals: `app/(modal)` contains backup/restore, business profile, change password, customize invoice, export, invite friend, logout, notification, profile, and smart login flows.
- Drawer: `src/components/layout/DrawerMenu.tsx`.
- Bottom tabs: `src/components/layout/BottomNav.tsx`.
- RBAC: `AuthGuard` blocks employee access to dashboard and reports at navigation level; server-side RLS is not represented in committed Supabase migrations.

# UI Components

## Auth Components

- `AuthGuard`: Route/session guard. Status: In Progress.
- `GradientBackground`: Auth background wrapper. Status: Completed.
- `OrDivider`: Auth divider. Status: Completed.

## Common Components

- `Avatar`: User/image avatar. Status: Completed.
- `Button`: Shared button with loading support. Status: Completed.
- `IconWrapper`: Icon/image wrapper. Status: Completed.
- `ImageContainer`: Reusable image container. Status: Completed.
- `InputText`: Reusable text input. Status: Completed.
- `InternalTabBar`: Internal tab UI. Status: Completed.
- `ListItemCard`: Shared list item card. Status: Completed.
- `PaddingWrapper`: Shared padding wrapper. Status: Completed.
- `RoundedIconButton`: Rounded icon action button. Status: Completed.
- `SearchFilter`: Search/filter input row. Status: Completed.
- `Subtitle`: Shared subtitle text. Status: Completed.
- `TextButton`: Text-only action. Status: Completed.
- `Title`: Shared title text. Status: Completed.
- `ValueSelect`: Select/value picker UI. Status: Completed.
- `Wrapper`: Generic layout wrapper. Status: Completed.

## Layout Components

- `AppHeader`: App top header. Status: Completed.
- `BottomNav`: Bottom navigation UI. Status: In Progress.
- `DrawerMenu`: Global drawer UI. Status: In Progress.
- `ScreenWrapper`: Shared screen wrapper. Status: Completed.

## Dashboard Components

- `IconWithBackground`: Icon tile. Status: Completed.
- `QuickCard`: Dashboard quick action card. Status: Completed.
- `SectionHeader`: Section header. Status: Completed.
- `StatCard`: Dashboard stat card. Status: Completed.

## Form Components

- `DateInput`: Date picker input. Status: Completed.
- `ProfilePicker`: Profile/image picker. Status: Completed.

## Modal Components

- `CustomModal`: Generic modal. Status: Completed.
- `CustomeBottomModal`: Bottom modal. Status: Completed.
- `DeleteModal`: Delete confirmation modal. Status: Completed.
- `FilterModal`: Filter modal. Status: Completed.
- `SuccessModal`: Success feedback modal. Status: Completed.

## Menu Components

- `MenuItem`: Drawer/menu item. Status: Completed.
- `MenuItemsWrapper`: Menu item group wrapper. Status: Completed.
- `ProfileCard`: Drawer profile card. Status: Completed.

## Notification Components

- `NotificationCard`: Notification row/card. Status: Completed.
- `TabBar`: Notification tab bar. Status: Completed.

## Report Components

- `ChartLegend`: Chart legend. Status: Completed.
- `CustomBarChart`: Bar chart wrapper. Status: Completed.
- `CustomLineChart`: Line chart wrapper. Status: Completed.
- `CustomPieChart`: Pie chart wrapper. Status: Completed.
- `MultiLineChart`: Multi-line chart wrapper. Status: Completed.
- `PlaceHolderReport`: Empty/placeholder report view. Status: Completed.
- `RankItemCard`: Ranking item row. Status: Completed.
- `ReportCard`: Report card. Status: Completed.
- `ReportValueSelect`: Report select control. Status: Completed.

## UI Components

- `CloseButton`: Close action. Status: Completed.
- `DetailsText`: Detail label/value text. Status: Completed.
- `IconButton`: Icon button. Status: Completed.
- `InfoField`: Information field row. Status: Completed.
- `InvoiceItemCard`: Invoice item row/card. Status: Completed.
- `InvoiceItemProductCard`: Invoice product selection card. Status: Completed.

## Provider Components

- `AppDataProvider`: Initializes local database before rendering app. Status: In Progress.

# Services

- Supabase service: `src/lib/supabase.ts` creates the Supabase client with SecureStore-backed auth persistence.
- Auth service: `src/services/auth/authService.ts` handles Supabase Auth and local-first profile creation.
- Session service: `src/services/sessionService.ts` saves, restores, refreshes, clears local sessions, restores sessions from biometric credentials, and keeps biometric tokens fresh after refresh.
- Profile service: `src/services/profileService.ts` fetches remote profile data, maps it to local shape, and performs local-first profile updates.
- User profile mapper: `src/services/userProfileMapper.ts` maps Supabase snake_case profile rows to local camelCase `User` records and back.
- Database services/repositories:
  - `usersRepository`: user lookup, upsert, local profile creation/update, biometric flag, mark synced.
  - `sessionRepository`: active auth session persistence.
  - `productsRepository`: local-first product create/update/pending-delete.
  - `syncQueueRepository`: enqueue/list/dequeue/failure handling for sync queue rows.
- Sync service: Not implemented yet; only queue repository exists.
- Storage service: `src/lib/secureStorage.ts` stores biometric credentials, token expiry, and flags in Expo SecureStore.
- Invoice services: `src/services/invoice/pdfService.ts`, `src/services/invoice/invoiceViewer.tsx`.
- Utilities: `src/Utility` contains chart scaling, report conversion, date, ranking, filtering, and status color helpers.

# Current Progress

- ✅ Authentication screens completed
- ✅ Core visual design and reusable UI components
- ✅ Expo Router route groups
- ✅ Drawer and bottom navigation UI
- ✅ Modal flows scaffolded
- ✅ SQLite database setup
- ✅ Drizzle schema
- ✅ Manual SQLite migration SQL
- ✅ Auth/session repositories
- ✅ Product repository with local-first queue writes
- ✅ User profile mapper for Supabase/local naming
- ✅ Session management and biometric flow integration
- ⏳ Profile/business profile backend integration
- ⏳ Sync queue processor
- ⏳ Inventory screens backed fully by SQLite
- ⏳ Invoice repositories and stock mutation transactions
- ⏳ Customer/supplier/employee repositories
- ⏳ Reports backed by SQLite queries
- ⏳ Backup and restore backend
- ⏳ Approval workflow

# Pending Work

- Implement sync engine to process `sync_queue`.
- Add Supabase migrations/RLS policies for all cloud tables.
- Implement conflict handling and retry backoff for sync.
- Add employee approval workflow and `staging_review_queue` integration.
- Add local-first repositories for customers, suppliers, employees, invoices, invoice items, ledger entries, payments, and reports.
- Add ledger and payment schema/tables.
- Wire stock, sales, parties, dashboard, and reports screens to SQLite repositories.
- Make invoice creation transactional: invoice, invoice items, stock decrement, customer dues, ledger/payment entries, and sync queue writes.
- Add backup/restore implementation.
- Add pagination and indexes where large lists are queried.
- Add tests for repositories, sync queue processing, auth/session restoration, and financial/inventory transactions.
- Clean existing lint warnings.
- Normalize old `appTypes.ts` snake_case frontend types with Drizzle/local types where appropriate.
- Add a user-facing disable biometric flow that clears SecureStore credentials and updates the local user biometric flag.

# Known Issues

- `npm run lint` passes with warnings only; current warnings include unused variables, hook dependency warnings, `==` usage, and import ordering in `src/constants/icons.ts`.
- No sync engine exists yet, so queued records are not automatically pushed or marked `synced`.
- Product repository has local-first writes, but most other business modules do not.
- Supabase profile writes are currently best-effort in auth/profile services; durable syncing should move into the future sync engine.
- `syncQueueRepository.listPending` orders by descending `createdAt`, despite queue comments mentioning FIFO/LIFO ambiguity.
- Manual SQLite migrations are not versioned; schema evolution strategy is incomplete.
- Supabase migrations/RLS policies are not committed.
- Some sample/default data and legacy types still use snake_case names that differ from Drizzle camelCase fields.
- Employee RBAC exists in navigation helpers but not in local mutation authorization or Supabase RLS migrations.
- Biometric enable/sign-in is integrated, but there is no completed settings flow to disable biometrics and clear saved credentials.

# Recent Architectural Decisions

- Local-first architecture is the project rule.
- SQLite is the source of truth for business data.
- Supabase is for authentication, cloud backup, multi-device sync, remote storage, notifications, and approval workflows.
- Screens should not depend directly on Supabase business-data responses.
- Zustand manages runtime/global UI state, not permanent business data.
- Repositories own SQLite access and local mutations.
- Local mutations should write a sync queue entry in the same transaction.
- IDs should be UUID strings generated with `crypto.randomUUID()`.
- User profile rows now use explicit mapping between Supabase `snake_case` and local Drizzle camelCase fields.
- Profile creation/update now writes to SQLite first and attempts remote writes as best-effort until the sync engine exists.
- Biometric login stores tokens and expiry in SecureStore, never passwords, and uses those tokens only after device biometric authentication succeeds.
- Biometric preference is treated as device-local and does not mark the user profile as a pending cloud sync mutation.

# Coding Standards

- Naming: Drizzle/local TypeScript fields use camelCase; SQLite/Supabase columns use snake_case.
- Folder organization: screens in `app`, reusable components in `src/components`, data access in `src/db`, business workflows in `src/services`, global runtime state in `src/store`.
- TypeScript: strict TypeScript is enabled. Avoid `any`, especially for database entities and service contracts.
- Components: keep UI reusable, typed, and aligned with existing NativeWind styling.
- Error handling: service functions should return typed result objects instead of throwing raw errors to UI.
- State management: do not store durable business data exclusively in Zustand.
- Database: use schema-first Drizzle types and repositories; use transactions for related local mutations.
- Sync: all inventory and financial mutations must be recoverable through `sync_queue`.
- UI: prefer `FlatList` for large datasets and `SafeAreaView className="flex-1 bg-slate-50"` for screens.

# Important Notes for Future AI Sessions

- Read this file before analyzing the project.
- Only inspect files relevant to the requested task.
- Do not refactor unrelated code.
- Preserve the local-first architecture.
- Keep SQLite as the business source of truth.
- Do not make screens wait on Supabase for business data.
- Do not introduce duplicate repository or mapping logic.
- Keep code modular, typed, and consistent with existing folders.
- Update this file whenever a major feature is completed or an architectural decision changes.
- When changing backend flows, keep local mutation, sync status, and `sync_queue` behavior together.
