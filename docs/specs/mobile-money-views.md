# Mobile Money Views

## Objective

Provide two lightweight, mobile-friendly pages accessible via Tailscale for quick access to core money functions without loading the full desktop UI. Both pages should work well on a phone-sized screen and require no knowledge of the desktop layout.

## New Routes

| Route | Component | Purpose |
|---|---|---|
| `/money-add` | `MobileAddComponent` | Add a single transaction |
| `/money-recent` | `MobileRecentComponent` | View the most recent N transactions |

Add both to `app.module.ts` alongside the existing flat routes and import each as standalone.

## Shared design constraints

- Dark theme via existing CSS variables in `styles.css` — no new theme work needed.
- Minimal chrome: a small header showing the page title and a back link to `/money`.
- All tap targets a minimum of 44px tall (Bootstrap `btn-lg` or explicit `min-height`).
- No desktop toolbar, no grid, no modal overlays.
- Both components are standalone and live under a new `src/app/money/mobile/` sub-directory.

---

## Page 1: Add Transaction (`/money-add`)

### Component

`MobileAddComponent` — `src/app/money/mobile/mobile-add.component`

### Behaviour

1. On load: fetch non-closed accounts and non-system categories via `MoneyService.getAccounts()` / `MoneyService.getCategories()`.
2. Present the form fields vertically:
   - **Date** — defaults to today; use `BsDatepickerModule` as in the desktop form.
   - **Account** — one SVG logo button per non-closed account (see Account selection below); single selection.
   - **Amount** — numeric input with a CR / DB toggle alongside it.
   - **Category** — colour chips using the short `id` code (see Category selection below); single selection.
   - **Description** — text input, full width.
3. A single **Save** button at the bottom. On tap:
   - Validate (same rules as `MoneyAddComponent.isFormValid()`).
   - Call `MoneyService.addTransaction()`.
   - On success: show a brief green success banner, then reset the form (date back to today, clear description and amount; keep account and category selected for convenience).
   - On error: show an inline red error message.
4. No pending list, no "Save All", no transfers, no keyboard shortcuts.

### Account selection

Display each account as a square button containing its SVG logo, sourced via `MoneyService.getAccountImage(account.id)` (resolves to `assets/images/account/##id##.svg`). Use the `x`-suffix variant (`moneyAccountDisabledImage`) for unselected accounts and the normal variant for the selected account, to give a clear selected/deselected visual state. Border the selected account's button in its `colour`.

### Category selection

Display categories as a compact wrapping grid of colour chips. Each chip shows the short `id` code (e.g. `GROC`, `UTIL`) as its label, with the category `colour` as the background (selected) or border (unselected), matching the colour logic from `MoneyAddComponent`. A label line above or below the grid shows the full `name` of the currently selected category (or a placeholder if none selected), so the user gets confirmation of their choice without the chips needing to show the full name.

### Reuse from `MoneyAddComponent`

- `MoneyService.getAccounts()`, `MoneyService.getCategories()`, `MoneyService.addTransaction()`.
- Colour helper logic (`accountBgColor`, `accountFgColor`, `catBgColor`, `catFgColor`, `catBorderColor`, `accountBorderColor`) — copy directly; no shared base class needed.
- `toTransaction()` conversion (date formatting, amount sign convention).
- Validation logic (`isFormValid()`).

### What is different from `MoneyAddComponent`

- Full-page route, not a modal overlay — no `addClosed` / `@Output()` pattern.
- Single-transaction flow only — no `pendingList`.
- Accounts shown as SVG logos, not text buttons.
- Categories shown as short `id` code chips with a separate full-name label, not full-name buttons.
- Larger touch targets throughout.
- Stacked vertical layout (no side-by-side columns).

---

## Page 2: Recent Transactions (`/money-recent`)

### Component

`MobileRecentComponent` — `src/app/money/mobile/mobile-recent.component`

### Behaviour

1. On load: fetch page 1 of transactions using the default filter and `PAGE_SIZE`.
2. Display results as a scrollable card list. Each card shows:
   - Date (formatted `dd-Mon-yyyy`)
   - Account name with its `colour` as a left border or coloured chip
   - Description
   - Amount formatted as `+£x.xx` (credit) or `-£x.xx` (debit), coloured green/red respectively
   - Category `id` code (short) with its `colour` as a chip
3. **Prev** and **Next** buttons for paging. Prev is disabled on page 1; Next is disabled on the last page.
4. Show the current page and total pages as `x of y` between the Prev/Next buttons.
5. Read-only — no editing, no selection, no actions.

### Filter and page size

Use `MoneyComponent.defaultFilter()` as the base (locked: false, predicted: false, empty accounts/categories arrays), then override `maxPageSize` with a constant `PAGE_SIZE` defined at the top of the component file.

`PAGE_SIZE` is not exposed in the UI — changing it requires a code edit. Start with a default of `20`.

### Page state

The component owns `currentPage` (starts at 1) and derives `totalPages` from `ITransactionPage.totalCount`. Each Prev/Next tap updates `currentPage` and re-fetches. Show a loading indicator while a fetch is in flight. On error, show an inline error message.

### Data

`MoneyService.getTransactions()` returns `ITransactionPage` containing `ITransactionReport[]`. Fields used:

| Display | Source on `ITransactionReport` |
|---|---|
| Date | `date` (ISO string) |
| Account name | `account.name` |
| Account colour | `account.colour` |
| Description | `description` |
| Amount | `amount.amount` (negative = debit) |
| Category code | `category.id` |
| Category colour | `category.colour` |

---

## Out of scope

- Editing or deleting existing transactions.
- Transfer between accounts.
- Reconciliation.
- Filter controls on the recent page.
- Page-size controls on either page (page size is a code constant).
- Push notifications or background refresh.
