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
- `src/services/`: Auth, session, profile, media storage, invoice PDF/viewer, and user profile mapping services.
- `src/store/`: Zustand stores and local secure storage helpers.
- `src/hooks/`: Session, drawer, and auth workflow hooks.
- `src/lib/`: Supabase client, secure storage helper, and sample data.
- `src/types/`: App, auth, and invoice TypeScript types.
- `src/constants/`: Routes, icons, theme, chart constants, and default data.
- `src/Utility/`: Report, chart, filtering, date, and ranking helpers.
- `assets/`: Images, icons, and fonts.
- `design/`: Reference UI screenshots.
- `supabase/`: Supabase SQL setup scripts, including the current profile/RLS setup in `supabase/bachatbuddy_setup.sql`.

# Features

## Authentication

Status: In Progress

Description:
Auth screens are implemented. Supabase Auth is used for owner sign-up, owner sign-in, OTP, password reset, sign-out, and session refresh. The sign-in form now accepts a single email-or-username identifier plus password; it no longer asks the user to choose a role. Role is resolved from the saved profile and then drives routing/RBAC. Local employee records can sign in from SQLite with email or username, even when no separate username was assigned. Local session/profile persistence exists through SQLite. App launch now requires a fresh unlock before protected business data is shown: if a valid biometric credential exists the splash routes to fingerprint, otherwise it routes to sign-in. Profile creation writes to SQLite and `sync_queue` first, then inserts/updates the matching Supabase `public.users` profile row. Supabase profile rows are now confirmed working with the committed setup SQL. Owner profiles use `business_id = user id`, avoiding a separate business id while still allowing future employee grouping. Drawer logout is wired to the shared sign-out flow and clears the active local session before returning to sign-in.

Main Files:
- `app/(auth)`
- `src/hooks/auth/useAuth.ts`
- `src/services/auth/authService.ts`
- `src/services/sessionService.ts`
- `src/services/profileService.ts`
- `src/store/authStore.ts`
- `src/db/repositories/sessionRepository.ts`
- `src/db/repositories/usersRepository.ts`
- `supabase/bachatbuddy_setup.sql`

## Biometric Login

Status: In Progress

Description:
Biometric credential storage and authentication are implemented through Expo Local Authentication and SecureStore. SecureStore now stores only compact biometric metadata and the enabled flag; session access/refresh tokens remain in SQLite `auth_sessions` to avoid SecureStore size limits. Passwords are never stored. The startup/sign-in routing now distinguishes between enabled biometrics and a valid saved biometric credential: app launch opens fingerprint only when a usable credential exists; otherwise it opens sign-in. The sign-in screen's `use Touch ID` action opens fingerprint when a valid credential exists, or `manage-fingerprint` when setup is missing. Touch ID setup now uses email-or-username plus password and infers the role from the authenticated profile. Expired, malformed, or stale biometric credentials are rejected and cleared so the next Touch ID attempt routes to setup. Biometric unlock restores the active local SQLite session after device authentication and refreshes Supabase tokens/profile in the background to keep login fast and local-first. Local-only employee sessions are not enabled for Touch ID setup yet because biometric setup still requires a cloud-authenticated account.

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
Expo Router groups are set up for auth, protected app screens, nested sale routes, and modals. `AuthGuard` blocks unauthenticated app access and employee access to owner-only dashboard/report routes. Session bootstrap initializes SQLite and biometric state only; it does not automatically authenticate from a previous saved SQLite session, so protected app screens remain locked until password sign-in or successful fingerprint unlock. The app stack registers the nested sale route group as `sale`, avoiding Expo Router child-name warnings for `sale/index`.

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
Dashboard summary cards are backed by SQLite through a typed dashboard repository. The screen loads local product, invoice, invoice item, and customer aggregates on focus, shows local loading/error states, and never depends on Supabase business-data responses. Money stat cards render `PKR` as a small prefix with the amount as the primary value. Quick Action and Quick Report cards behave as navigation buttons only; they route to the closest existing stock, sales, reports, and parties screens instead of displaying inline metric values. Dedicated filtered record screens for quick reports, such as low-stock-only items, are still pending.

Completed Updates:
- Added `src/db/repositories/dashboardRepository.ts` for SQLite-backed dashboard summary aggregation.
- Replaced hardcoded dashboard stat values with local SQLite totals for stock, sales amount, active customers, and remaining dues/loans.
- Added focus-based dashboard refresh so returning from stock, sales, or parties reloads local aggregate data.
- Updated stat card currency display so `PKR` is smaller than the numeric amount and not wrapped in parentheses.
- Restored Quick Report cards to button-only behavior and wired quick actions/reports to existing app routes.

Main Files:
- `app/(app)/dashboard/index.tsx`
- `src/db/repositories/dashboardRepository.ts`
- `src/components/dashboard`

## Inventory / Stock

Status: Completed

Description:
Stock list, details, add, edit, supplier selection, filtering, pull-to-refresh, and delete flows are backed by SQLite. Product create/update/delete actions write to the local `products` table first, enqueue recoverable `sync_queue` rows, refresh the stock UI from SQLite immediately, and use `pending_approval` plus `approval_request` queue rows for employee inventory changes.

Completed Updates:
- Replaced stock list sample data with `listProductsWithRelations()` from SQLite and mapped Drizzle rows into the existing stock UI shape.
- Wired add product, edit product, and remove product modals to `productsRepository` local-first mutations.
- Added SQLite supplier selection for product forms through `suppliersRepository.listSuppliers()`.
- Added `src/services/inventory/productUiMapper.ts` to keep the current UI model compatible with Drizzle/local rows without broad type churn.
- Updated product repository list queries to hide `pending_delete` rows and support relation-backed inventory screens.
- Fixed edit-product saves for products without suppliers by treating the UI placeholder supplier as `null`, preventing SQLite foreign key failures when updating images or other fields.

Main Files:
- `app/(app)/stock`
- `src/db/repositories/productsRepository.ts`
- `src/db/repositories/suppliersRepository.ts`
- `src/services/inventory/productUiMapper.ts`
- `src/components/common/ListItemCard.tsx`
- `src/components/modal/FilterModal.tsx`

## Sales And Invoices

Status: In Progress

Description:
Invoice list, add, detail, filtering, add-invoice customer/product/subtotal editing, saved-invoice customer selection, and saved-invoice amount/date/image edits are backed by SQLite. Invoice creation writes the invoice, invoice items, product stock decrements, customer purchase/due updates, and sync queue rows inside one local transaction before the UI returns to the invoice list. Invoice deletion marks the invoice/items pending delete and restores product stock in the same local transaction. Saved-invoice customer changes update the invoice `customer_id`, move invoice totals between old/new customer aggregates, and enqueue recoverable sync rows. Add-invoice draft detail edits update local draft state until the full invoice is saved. Invoice preview, PDF generation, print, share, and save-location picker flows exist.

Completed Updates:
- Added `src/db/repositories/invoicesRepository.ts` for relation-backed invoice listing/detail lookup, local-first invoice creation, invoice detail/amount updates, and pending-delete handling.
- Added atomic stock mutation transactions for invoice creation and deletion, including product quantity/sold-stock/status recalculation.
- Added sync queue writes for invoices, invoice items, product stock changes, and customer due/order updates, with `pending_approval` support for employee actions.
- Added SQLite customer listing for invoice customer selection through `customersRepository`.
- Replaced sales list/detail sample data with SQLite-backed invoice reads and mapped Drizzle rows into the current invoice UI model.
- Replaced invoice product selection sample data with SQLite products and quantity/price draft updates.
- Fixed add-invoice due date/image edits so unsaved `INV-PENDING` drafts update local draft state instead of calling SQLite with an empty invoice id.
- Clarified that add-invoice drafts keep `invoice_id = ""` and `invoice_number = "INV-PENDING"` until the user presses SAVE; only the save transaction assigns `crypto.randomUUID()` and a persisted invoice number.
- Added saved-invoice customer updates from the invoice detail screen, including SQLite invoice updates, old/new customer aggregate reconciliation, sync queue rows, and customer creation from the invoice customer picker.
- Added `app/(app)/sale/preview-invoice.tsx` and route wiring so the invoice detail `PREVIEW` button opens a local SQLite-backed invoice preview screen.
- Added invoice preview mapping in `src/services/invoice/invoicePreviewMapper.ts` so persisted invoices render through the existing invoice HTML/PDF template with business profile data and saved signature state.
- Added preview actions for print, share, and save. Android save opens the system folder picker through Expo Storage Access Framework; non-Android platforms use the native share/save sheet.
- Added print/PDF page margins to the invoice template so generated invoices do not touch page edges.

Main Files:
- `app/(app)/sale`
- `src/db/repositories/invoicesRepository.ts`
- `src/db/repositories/customersRepository.ts`
- `src/services/invoice/invoiceUiMapper.ts`
- `src/services/invoice/invoicePreviewMapper.ts`
- `src/services/invoice/pdfService.ts`
- `src/services/invoice/invoiceViewer.tsx`
- `src/templates/invoiceTemplate.ts`
- `src/templates/mockInvoiceData.ts`
- `src/components/ui/InvoiceItemCard.tsx`
- `src/components/ui/InvoiceItemProductCard.tsx`

## Reports

Status: Completed

Description:
Report screens and chart components are backed by SQLite queries for stock, sales, and party analytics. Report tabs load from local SQLite through a typed repository, refresh on focus/filter changes, and no longer depend on sample chart constants or mock product/customer/supplier data.

Completed Updates:
- Added `src/db/repositories/reportsRepository.ts` for SQLite-backed report data aggregation and typed chart/ranking payloads.
- Wired sales reports to local invoice and invoice item rows for sales overview, payment status, revenue, and profit charts.
- Wired stock reports to local product and invoice item rows for added stock, sold stock, stock status, and product ranking charts.
- Wired party reports to local customer and supplier rows for customer growth, customer purchase/due rankings, and supplier value rankings.
- Kept report filtering local-first by recalculating SQLite-backed datasets for daily, weekly, monthly, yearly, and ranking dropdown changes.
- Added report loading/error/empty states so empty local databases show safe UI instead of mock report data.
- Fixed supplier overview ranking so the supplier rank dropdown controls supplier data instead of reusing the customer rank filter.

Main Files:
- `app/(app)/reports`
- `src/db/repositories/reportsRepository.ts`
- `src/components/report`
- `src/Utility`
- `react-native-gifted-charts`

## Parties / Ledger

Status: In Progress

Description:
Customer, supplier, employee, party detail, add, edit, filter, pull-to-refresh, and delete flows are backed by SQLite. Customer and supplier actions write to their local tables first and enqueue recoverable `sync_queue` rows. Local employee actions use the existing SQLite `users` table with `role = 'employee'` and owner `business_id`; Supabase employee directory sync now writes those records to `public.employees` instead of `public.users`, because `public.users` is tied to Supabase Auth identities. Employee-triggered mutations use `pending_approval` plus `approval_request` queue rows. Ledger entries and payments are not implemented yet.

Completed Updates:
- Expanded `customersRepository` from list-only to typed local-first create/update/pending-delete APIs with queue rows and `pending_approval` support.
- Expanded `suppliersRepository` from list-only to typed local-first create/update/pending-delete APIs with queue rows and `pending_approval` support.
- Added `employeesRepository` for employee user rows, including business-scoped listing, detail lookup, local create/update/pending-delete, and sync queue writes.
- Added Drizzle relations for customer/supplier `createdBy` and `lastUpdatedBy` users so party screens can load relation-backed SQLite data.
- Added `src/services/parties/partyUiMapper.ts` to map Drizzle/local customer, supplier, and employee rows into the existing party UI types.
- Replaced customer, supplier, and employee party screen sample data with SQLite repository reads, pull-to-refresh, empty/loading states, and local-first delete handling.
- Wired add/edit customer, supplier, and employee modals to local-first repository mutations and immediate SQLite refresh callbacks.
- Routed employee sync queue rows to Supabase `public.employees`, while keeping local reconciliation against SQLite `users` employee rows.
- Added `public.employees` table, RLS policies, indexes, and timestamp trigger to `supabase/bachatbuddy_setup.sql`.
- Fixed party detail modal avatars so saved customer, supplier, and employee images render from local `img` values instead of always falling back to initials.

Main Files:
- `app/(app)/parties`
- `src/db/schema.ts`
- `src/db/repositories/customersRepository.ts`
- `src/db/repositories/suppliersRepository.ts`
- `src/db/repositories/employeesRepository.ts`
- `src/services/syncQueueProcessor.ts`
- `src/services/parties/partyUiMapper.ts`
- `supabase/bachatbuddy_setup.sql`
- `src/components/common/ListItemCard.tsx`

## Profile And Business Profile

Status: Completed

Description:
Profile and business profile modals are integrated with the local auth profile. Screens, drawer profile card, and app top bar render the current SQLite-backed user from the Zustand session cache instead of hardcoded values. Profile and business profile edits initialize from the saved local user, write updates to SQLite through `usersRepository.updateProfile`, enqueue a `sync_queue` update row, refresh the auth store immediately, and attempt a best-effort Supabase profile update while the full sync engine is still pending. Business profile stores a dedicated `businessLogo`/`business_logo` image separate from the personal profile image so invoices can later use the business logo without overwriting the user avatar. Picked business logos are copied into persistent app document storage before SQLite is updated, preventing temporary ImagePicker cache URIs from disappearing after restart/session expiry. Profile fetch/sign-in queries include `business_logo`, and profile sync preserves newer pending local profile changes so cloud-null values do not wipe locally saved logos. Best-effort profile cloud writes upload local profile/business logo image URIs to Supabase Storage before updating the remote profile row.

Main Files:
- `app/(modal)/profile`
- `app/(modal)/business_profile`
- `src/services/localMediaService.ts`
- `src/services/profileService.ts`
- `src/services/mediaStorageService.ts`
- `src/db/repositories/usersRepository.ts`
- `src/store/authStore.ts`
- `src/components/layout/AppHeader.tsx`
- `src/components/menu/ProfileCard.tsx`

## Backup And Restore

Status: In Progress

Description:
Backup/restore screens are wired to a backend service. Owners can package the implemented SQLite tables into a typed JSON snapshot, upload a versioned backup plus `latest.json` to private Supabase Storage, save local backup metadata, and upsert a Supabase `backup_manifests` row. Restore downloads the latest cloud backup for the active business, validates the snapshot schema/business id, confirms overwrite with the user, and replaces the implemented local SQLite tables in dependency order. The screen now shows local last-backup date and size from SQLite metadata instead of hardcoded values. Backup/restore request approval UI still uses mock request data, and advanced conflict handling is not complete.

Completed Updates:
- Added `src/services/backupRestoreService.ts` for SQLite snapshot creation, Supabase Storage upload/download, manifest writes, snapshot validation, and full local restore.
- Added local `backup_metadata` Drizzle schema, migration SQL, indexes, generated row types, and `backupMetadataRepository`.
- Wired `app/(modal)/backup_restore` backup and restore actions to the backend service with signed-in user/business checks and destructive restore confirmation.
- Replaced hardcoded last backup date/size cards with local backup metadata loaded from SQLite.
- Added `public.backup_manifests`, owner-only RLS policies, update trigger, and private `bachatbuddy-backups` Storage bucket/policies to `supabase/bachatbuddy_setup.sql`.
- Fixed Supabase backup SQL type comparisons so `backup_manifests.business_id` is UUID and Storage path policies compare `current_user_business_id()::text` to folder names.
- Fixed React Native backup uploads by sending JSON snapshots to Supabase Storage as UTF-8 `ArrayBuffer` data instead of `Blob`, avoiding generic `Network Request Failed` upload errors.
- Split backup and restore button loading states so starting a backup no longer shows the restore button loader.
- Added backup freshness detection so pressing backup with no profile/business SQLite changes since the latest local backup metadata shows an up-to-date message instead of uploading a duplicate snapshot; volatile `auth_sessions` and `sync_queue` bookkeeping are ignored for this check.
- Fixed React Native restore downloads by reading Supabase Storage backup responses through Blob, ArrayBuffer, typed-array, or string-compatible paths instead of assuming `data.text()` exists.
- Added restore fallback handling for React Native Blob objects through `FileReader.readAsText()` and private Supabase signed-URL fetch when direct Storage download bodies are unreadable.
- Fixed restore foreign-key ordering by clearing local `backup_metadata` before replacing `users`, then rewriting restored backup metadata after the snapshot restore completes.

Main Files:
- `app/(modal)/backup_restore`
- `src/services/backupRestoreService.ts`
- `src/db/repositories/backupMetadataRepository.ts`
- `src/db/schema.ts`
- `src/db/migrations.ts`
- `supabase/bachatbuddy_setup.sql`

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
Screens exist for export, invite friend, notifications, notification options, logout, and change password. Logout is wired through the drawer confirmation modal. Other backend integrations are incomplete or partial.

Main Files:
- `app/(modal)/export`
- `app/(modal)/invite_friend`
- `app/(modal)/notification`
- `app/(modal)/change_password`

## Sync Engine

Status: In Progress

Description:
The `sync_queue` table, repository, and app-start background processor exist. The processor reads ready queued/failed rows FIFO, marks each row as `processing`, uploads local image URIs in queued payloads to Supabase Storage, pushes insert/update/delete mutations to Supabase, sends approval requests to `staging_review_queue`, marks successfully pushed local rows as `synced`, removes locally deleted rows after remote delete succeeds, dequeues successful sync items, and records failed attempts with exponential retry backoff. Local mutations now wake the sync processor immediately after SQLite commits instead of waiting for the next interval tick.

Completed Updates:
- Added `src/services/syncQueueProcessor.ts` for queue processing, Supabase mutation dispatch, approval request upload, local sync status reconciliation, and interval start/stop control.
- Added `src/services/syncQueueNotifier.ts` so repositories can request immediate background sync after enqueueing local mutations.
- Updated product, customer, supplier, employee, user/profile, invoice, and generic sync queue enqueue paths to request sync immediately after the local transaction succeeds.
- Updated `src/db/repositories/syncQueueRepository.ts` to process FIFO, list retry-ready failed rows, mark rows as `processing`, requeue rows when needed, store retry backoff metadata on failures, and reset failed local-media sync rows for prompt retry.
- Updated `src/components/providers/AppDataProvider.tsx` to initialize SQLite, enqueue existing local media uploads, retry failed media uploads, start the sync queue processor, and stop it on provider cleanup.
- Added `supabase/bachatbuddy_setup.sql` with `public.users`, `staging_review_queue`, helper RPCs, and RLS policies aligned with the app payloads.
- Added `src/services/mediaStorageService.ts` and sync-processor integration so `img` and `business_logo` local URIs are uploaded to Supabase Storage before remote row upserts or approval payload uploads.
- Fixed React Native image sync by reading local file URIs through Expo FileSystem `File(...).arrayBuffer()` instead of relying on `fetch(uri).blob()` for device files.
- Normalized image MIME types before upload and expanded the `bachatbuddy-media` bucket setup to allow `image/heic` and `image/heif`.

Main Files:
- `src/db/repositories/syncQueueRepository.ts`
- `src/services/syncQueueProcessor.ts`
- `src/services/syncQueueNotifier.ts`
- `src/services/mediaStorageService.ts`
- `src/services/mediaBackfillService.ts`
- `src/components/providers/AppDataProvider.tsx`
- `src/db/schema.ts`

# Database

- Local database: Expo SQLite database named `bachatbuddy.db`.
- ORM: Drizzle ORM with schema in `src/db/schema.ts`.
- Cloud database: Supabase PostgreSQL, intended for auth, backup, sync, remote storage, notifications, and approvals.
- Supabase setup SQL: `supabase/bachatbuddy_setup.sql` creates/updates `public.users`, `public.employees`, business sync tables, `public.staging_review_queue`, `public.backup_manifests`, username lookup RPCs, owner/business helper functions, millisecond timestamp triggers, indexes, RLS policies, and the `bachatbuddy-media`/`bachatbuddy-backups` Storage bucket policies.
- Supabase Storage: `bachatbuddy-media` stores synced application images. SQLite keeps local image URIs for immediate offline display; sync uploads those images and sends public Storage URLs in remote payloads.
- Supabase backup storage: `bachatbuddy-backups` stores private JSON database snapshots under `{business_id}/{backup_id}.json` and `{business_id}/latest.json`; `public.backup_manifests` stores owner-scoped backup metadata.
- Existing local tables: `users`, `auth_sessions`, `customers`, `suppliers`, `products`, `invoices`, `invoice_items`, `sync_queue`, `backup_metadata`.
- The `users` table includes `business_logo` for invoice-ready business branding, separate from the personal/profile `img` field.
- Owner user rows use `business_id = id`; employee rows should use the owner's user id as `business_id` when employee management is implemented.
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
- Migration status: Manual local SQLite migration exists in `src/db/migrations.ts`; Supabase setup SQL exists in `supabase/bachatbuddy_setup.sql`; no generated Drizzle migration files are committed for the current schema.
- Missing standalone local tables: ledger entries, payments, staging approval mirror, and sync conflict metadata. Employees currently use local SQLite `users` rows with `role = 'employee'` and shared owner `business_id`, but sync to Supabase `public.employees`.

# State Management

- `src/store/authStore.ts`: Auth session, current user, role, loading state, biometric flag, and RBAC helper methods. Zustand only; SQLite stores durable session/profile data.
- `src/store/biometricStore.ts`: Biometric enable/check/authenticate workflow using secure storage and Expo Local Authentication. It treats missing, expired, malformed, or stale credentials as disabled and clears stale SecureStore flags.
- `src/store/invoiceCustomizationStore.ts`: Invoice customization UI/template options.
- `src/lib/secureStorage.ts`: Secure storage key definitions/helper area for compact biometric metadata.
- Persistence strategy: Durable business/auth data should live in SQLite or SecureStore where appropriate. Zustand is runtime state/cache only.

# Navigation

- Router: Expo Router.
- Public routes: `app/(auth)` and splash/index routing.
- Protected routes: `app/(app)` guarded by `src/components/auth/AuthGuard.tsx`.
- Main protected sections: dashboard, stock, sale, reports, parties.
- Modals: `app/(modal)` contains backup/restore, business profile, change password, customize invoice, export, invite friend, logout, notification, profile, and smart login flows.
- Drawer: `src/components/layout/DrawerMenu.tsx`.
- Bottom tabs: `src/components/layout/BottomNav.tsx`.
- RBAC: `AuthGuard` blocks employee access to dashboard and reports at navigation level; initial Supabase RLS exists for profile and approval tables, but full business-table RLS is not complete.

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

- Supabase service: `src/lib/supabase.ts` creates the Supabase client with app-managed SQLite session persistence; Supabase Auth SecureStore persistence is disabled to avoid oversized SecureStore payloads.
- Supabase setup: `supabase/bachatbuddy_setup.sql` configures profile/approval cloud tables, RLS policies, helper RPCs, and timestamp triggers.
- Auth service: `src/services/auth/authService.ts` handles Supabase Auth and local-first profile creation.
- Session service: `src/services/sessionService.ts` saves, restores, refreshes, clears local sessions, restores sessions after biometric authentication, and keeps local SQLite tokens fresh after refresh. Biometric restore returns from the active local SQLite session immediately when compact SecureStore metadata is valid, then refreshes Supabase tokens/profile in the background.
- Profile service: `src/services/profileService.ts` fetches remote profile data, maps it to local shape, and performs local-first profile updates.
- Media storage service: `src/services/mediaStorageService.ts` uploads local image URIs from sync payloads to the `bachatbuddy-media` Supabase Storage bucket and returns public URLs for remote rows.
- Local media service: `src/services/localMediaService.ts` copies selected local media into persistent app document storage before SQLite stores the URI.
- Backup/restore service: `src/services/backupRestoreService.ts` creates typed local SQLite snapshots, uploads/restores the latest private Supabase backup, records local metadata, and updates cloud backup manifests.
- Media backfill service: `src/services/mediaBackfillService.ts` finds existing SQLite records with local image URIs and enqueues update rows so older saved images can be uploaded through the normal sync queue.
- User profile mapper: `src/services/userProfileMapper.ts` maps Supabase snake_case profile rows to local camelCase `User` records and back.
- Database services/repositories:
  - `usersRepository`: user lookup, upsert, local profile creation/update, biometric flag, mark synced.
  - `sessionRepository`: active auth session persistence.
  - `productsRepository`: relation-backed product listing plus local-first product create/update/pending-delete and employee approval queue writes.
  - `customersRepository`: relation-backed customer listing plus local-first customer create/update/pending-delete and employee approval queue writes.
  - `suppliersRepository`: relation-backed supplier listing plus local-first supplier create/update/pending-delete and employee approval queue writes.
  - `employeesRepository`: business-scoped employee listing/detail plus local-first employee user create/update/pending-delete and sync queue rows targeting Supabase `public.employees`.
  - `invoicesRepository`: local-first invoice create/update/delete flows with invoice item writes, product stock mutation transactions, customer due updates, and sync queue recovery rows.
  - `reportsRepository`: SQLite-backed stock, sales, and party report aggregation for chart datasets, status pies, and ranked lists.
  - `dashboardRepository`: SQLite-backed dashboard summary aggregation for local stock, sales, customer, due, invoice, profit, and top-product data.
  - `syncQueueRepository`: enqueue/list/dequeue/failure handling for sync queue rows.
  - `backupMetadataRepository`: latest backup lookup, completed-backup metadata upsert, and restored-state marking.
- Sync service: `src/services/syncQueueProcessor.ts` processes queued local mutations in the background and reconciles local sync status after successful Supabase pushes.
- App data provider: `src/components/providers/AppDataProvider.tsx` initializes SQLite, enqueues existing local media uploads, and starts/stops the background sync queue processor.
- Employee sync note: employee queue rows target remote `employees`; old queued employee rows with table name `users` are also routed to `employees` by payload role for compatibility.
- Storage service: `src/lib/secureStorage.ts` stores compact biometric metadata, expiry, and enabled flags in Expo SecureStore; session tokens are stored in SQLite.
- Invoice services: `src/services/invoice/pdfService.ts`, `src/services/invoice/invoiceViewer.tsx`, `src/services/invoice/invoiceUiMapper.ts`, `src/services/invoice/invoicePreviewMapper.ts`.
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
- ✅ Fresh app launch security gate for password/fingerprint unlock
- ✅ Fast local-first biometric unlock with background token/profile refresh
- ✅ Drawer logout confirmation wired to sign-out
- ✅ Keyboard-aware auth forms
- ✅ Email-or-username password sign-in with role inferred from the saved profile
- ✅ Profile/business profile backend integration
- ✅ Sync queue processor
- ✅ Inventory screens backed fully by SQLite
- ✅ Invoice repositories and stock mutation transactions
- ✅ Saved-invoice customer updates backed by SQLite and sync queue rows
- ✅ Invoice preview, print/share/save PDF actions, and Android save-location picker
- ✅ Customer/supplier/employee repositories
- ✅ Customer/supplier/employee backed fully by SQLite
- ✅ Supabase Storage image upload integration for synced media payloads
- ✅ Startup backfill for existing local image URIs
- ✅ Immediate sync wake-up after local queue writes
- ✅ React Native local image upload fix for Supabase Storage sync
- ✅ Reports backed by SQLite queries
- ✅ Dashboard summary cards backed by SQLite queries
- ✅ Dashboard quick action/report cards restored to route-button behavior
- ✅ Business logo local persistence and `business_logo` profile restore fixes
- ✅ Expo Router nested sale route warning fixed
- ✅ Reanimated transform/layout animation warning fixed on splash logo
- ✅ SecureStore oversized session payload warning fixed by keeping tokens in SQLite
- ✅ Backup and restore backend foundation
- ⏳ Approval workflow

# Pending Work

- Tighten Supabase Storage policies to business-scoped paths if private media access becomes required.
- Implement conflict handling and stale `processing` row recovery for sync.
- Complete employee approval workflow UI and local approval-state handling around `staging_review_queue`.
- Add local-first create/update repositories for ledger entries, payments, and reports.
- Add ledger and payment schema/tables.
- Add dedicated filtered destination screens for dashboard quick reports, such as low-stock items, unpaid invoices, pending dues, and top products.
- Extend invoice transactions with ledger/payment entries after ledger and payment schema tables exist.
- Persist saved-invoice product edits with stock difference reconciliation and sync queue rows.
- Complete backup/restore request approval UI and owner/employee request backend.
- Add backup conflict/staleness handling before overwriting local data with older snapshots.
- Add pagination and indexes where large lists are queried.
- Add tests for repositories, sync queue processing, auth/session restoration, and financial/inventory transactions.
- Clean existing lint warnings.
- Normalize old `appTypes.ts` snake_case frontend types with Drizzle/local types where appropriate.
- Complete/verify the user-facing disable biometric flow in smart-login/settings so it clears SecureStore credentials and updates the local user biometric flag.

# Known Issues

- `npm run lint` passes with warnings only; current warnings include unused variables, hook dependency warnings, `==` usage, and import ordering in `src/constants/icons.ts`.
- Sync queue processor exists and now wakes immediately after local queue writes, but conflict resolution, online/offline network detection, stale `processing` row recovery, and stricter business-scoped Supabase Storage access still need to be completed.
- Product, invoice, party, report, and dashboard summary screens are local-first, but ledger and payment modules do not yet have completed SQLite-backed flows.
- Supabase profile writes now succeed when `supabase/bachatbuddy_setup.sql` has been run, but auth/profile services still use best-effort direct writes alongside queued retry behavior.
- Supabase media upload sync depends on the `bachatbuddy-media` bucket and policies from `supabase/bachatbuddy_setup.sql`; remote image upload will fail and retry if that SQL has not been applied, including the current MIME list for JPEG/PNG/WebP/GIF/HEIC/HEIF.
- Supabase backup/restore depends on the `bachatbuddy-backups` bucket, `backup_manifests` table, and policies from `supabase/bachatbuddy_setup.sql`; backup or restore will fail if that SQL has not been applied.
- Backup restore currently overwrites the implemented local SQLite tables from the latest cloud snapshot after confirmation; conflict checks for newer local changes and backup request approvals are still pending.
- Manual SQLite migrations are not versioned; schema evolution strategy is incomplete.
- Supabase setup is committed as a SQL setup file, but it is not yet organized as versioned Supabase CLI migrations.
- Some sample/default data and legacy types still use snake_case names that differ from Drizzle camelCase fields.
- Employee RBAC exists in navigation helpers; Supabase RLS has initial owner/business helper policies for profile and approval tables, but local mutation authorization and full table-level RLS are still incomplete.
- Biometric enable/sign-in is integrated and enforces a fresh app-launch unlock. Stale or expired biometric credentials are cleared automatically, but the user-facing settings flow for manually disabling biometrics still needs completion/verification.

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
- Profile creation/update now writes to SQLite first, queues the mutation, and also attempts remote writes against the configured Supabase `public.users` table.
- Owner profiles use the owner's Supabase Auth user id as `business_id`; employee profiles should share that owner id later. No separate business table is required yet.
- Employee records are represented locally as SQLite `users` rows with `role = 'employee'`; in Supabase they are business directory rows in `public.employees`, not auth profile rows in `public.users`.
- Profile, business profile, drawer profile card, and app top bar now read from the local auth profile cache; successful saves refresh the Zustand session cache from the saved SQLite row.
- Business logos are stored as a dedicated local user/business profile field (`businessLogo` locally, `business_logo` in SQLite/Supabase payloads) so invoice generation can reference the logo independently from the user avatar.
- Picked images remain local SQLite values for immediate offline use; business logos are first copied to persistent app document storage, while sync uploads `img` and `business_logo` values to Supabase Storage and sends public Storage URLs in Supabase row/approval payloads.
- Biometric login stores compact user/session metadata and expiry in SecureStore, never passwords or large access/refresh token payloads. Session tokens are stored in SQLite `auth_sessions` and are used only after device biometric authentication succeeds.
- Password sign-in uses one email-or-username identifier. The UI never asks the user to choose a role; role comes from the SQLite/Supabase profile. Local employee records can sign in from SQLite by email or username, including employees whose username is effectively absent or email-derived.
- App launch does not auto-restore the previous SQLite session into authenticated Zustand state. It initializes SQLite/biometric state, then requires password sign-in or fingerprint unlock before protected routes can be used.
- Biometric credentials must be valid, non-expired, and structurally complete to count as setup. Stale SecureStore flags are cleared when no usable metadata exists.
- Biometric unlock is local-first: it validates compact SecureStore metadata, restores the active SQLite session immediately, routes into the app, and refreshes Supabase tokens/profile in the background.
- Biometric preference is treated as device-local and does not mark the user profile as a pending cloud sync mutation.
- Sync queue processing is app-started from `AppDataProvider`, processes FIFO, retries failed rows with exponential backoff, and only marks local records `synced` after Supabase confirms the queued mutation.
- Add-invoice screens treat `INV-PENDING` as a draft only: due date, image, customer, products, and totals update screen state until SAVE runs the SQLite invoice transaction and assigns the real UUID/invoice number.
- Invoice preview reads persisted invoice data from SQLite, maps it through `invoicePreviewMapper`, and renders/prints/shares/saves using the shared HTML/PDF invoice template so preview and exported files stay consistent.
- Android invoice PDF save uses Expo Storage Access Framework to let the user choose a folder; non-Android platforms use the native share/save sheet because Expo does not expose the same folder picker there.
- Backup snapshots are full local SQLite JSON snapshots for the currently implemented tables, stored privately in Supabase Storage with local `backup_metadata` as the UI source for last-backup details.

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
