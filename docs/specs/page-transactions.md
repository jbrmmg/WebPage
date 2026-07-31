# JBR-684 handle paging in the transaction list API

## Objective

Currently, the server limits the number of transactions returned in the transaction list API to the value specified in `maxPageSize`.  This should be changed to be more of a page model - the client will provide the page size and page number and the server needs to indicate the total number of transactions that meet the filter.

## Requirement

A new endpoint has been added at `/money/transaction/list/page`, extending the `/money/transaction/list` endpoint.

Change all uses of `/money/transaction/list` to use `/money/transaction/list/page`, the request payload (TransactionFilter) is the same but the UI will now need to specify the page number.

The response contains a list of transactions as now but is wrapped in a parent object that has the following properties in addition to the transaction array that is currently retuned.

A new TypeScript interface `ITransactionPage` will be required that contains the following properties:

+ totalCount - the total number of transactions.
+ pageNumber - the page number returned.
+ maxPageSize - the page size returned
+ transactions - same as the array of transactions that is returned by the existing endpoint.

MoneyToolbarComponent already contains the necessary controls to use the new interface, but will need to generate events for prevClick, nextClick and pageSizeChange - these will need to be handled by the MoneyComponent.

### Environment configuration

Rename the existing `moneyTransactionList` key to `moneyTransactionListPage` in both `environment.prod.ts` and `environment.ts`, updating its value to `money/transaction/list/page`. Update all references in `money.service.ts` and `money.service.spec.ts` accordingly.

The dev environment fixture file referenced by `environment.ts` should be updated to return a response that matches the new paged shape (`{ totalCount, pageNumber, maxPageSize, transactions }`).

### Page state and data flow

`MoneyComponent` owns the page state. The flow is as follows:

1. `MoneyComponent` maintains `filter: TransactionFilter` which includes `pageNumber` and `maxPageSize`.
2. `GridTransaction` receives the filter as an `@Input()`, calls the new endpoint, and receives back the paged response.
3. `GridTransaction` emits `totalCount` back to `MoneyComponent` via a new `@Output() totalCountChange: EventEmitter<number>`.
4. `MoneyComponent` derives `totalPages = Math.ceil(totalCount / filter.maxPageSize)` and passes `currentPage` and `totalPages` down to `MoneyToolbarComponent` as `@Input()` bindings.
5. `MoneyToolbarComponent` uses these inputs to enable/disable the Prev and Next buttons and to reflect the current page size in the dropdown.

### Initial page number

`MoneyComponent.defaultFilter()` must set `pageNumber = 1` in addition to the existing `maxPageSize = 300`.

### Toolbar inputs

`MoneyToolbarComponent` requires the following new `@Input()` bindings so it can reflect state and enable/disable controls correctly:

+ `currentPage: number` — the current page number (drives Prev/Next enabled state).
+ `totalPages: number` — the total number of pages (disables Next when `currentPage >= totalPages`).

The existing internal `pageSize` field should become an `@Input()` initialised from `filter.maxPageSize` so the dropdown reflects the filter state rather than a hard-coded default.

### Filter change resets page

When `onFilterApplied()` is called in `MoneyComponent` (user applies a new filter), `filter.pageNumber` must be reset to `1` before the updated filter is passed to `GridTransaction`. This ensures paging always starts from the first page after a filter change.

When `MoneyComponent` handles the `pageSizeChange` event from the toolbar, it must update `filter.maxPageSize` with the new value and also reset `filter.pageNumber = 1`. A larger page size may reduce the total number of pages, making the current page number invalid.

### Test updates

The existing test in `money.service.spec.ts` at line 322 asserts against `environment.moneyTransactionList` and expects `ITransactionReport[]`. It must be updated to:

+ Use the renamed environment key `environment.moneyTransactionListPage`.
+ Flush a response matching the new paged shape and assert the returned observable emits the correct `ITransactionPage` object.