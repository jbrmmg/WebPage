// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Money URLs
  moneyTransactionList: "api/money/transaction.json",
  moneyTransactionUrlFormat: "api/money/transaction.##type##.json",
  moneyCategoryUrl: "api/money/category.json",
  moneyAccountUrl: "api/money/account.json",
  moneyAddUrl: "api/money/account.json",
  moneyTypeUrl: "api/money/types.json",
  moneyStatementUrl: "api/money/statements.json",
  moneyUpdateTransactionUrl: "api/money/update.json",
  moneyDeleteTransactionUrl: "api/money/update.json",
  moneyLockStatementUrl: "api/money/update.json",
  moneyReconcileTransactionUrl: "api/money/update.json",
  moneyMatchUrl: "api/money/match.##accountId##.json",
  moneyClearDataUrl: "api/money/update.json",
  moneyAutoAcceptUrl: "api/money/update.json",
  moneySetCategoryUrl: "api/money/update.json",
  moneyGetRegularUrl: "api/money/regular.json",
  moneyGetFilesUrl: "api/money/reconcile.files.json",
  moneyLoadFileUrl: "api/money/reconcile.files.json",
  moneyAccountImage: "assets/images/account/##id##.svg",
  moneyAccountDisabledImage: "assets/images/account/##id##x.svg",
  moneyFileUpdates: "money/reconciliation/file-updates",

  backupGetPreImportFiles: "api/backup/import-files",
  backupFileUpdates: "api/backup/file-updates",
  backupFileSummaryUpdates: "api/backup/summary-updates",
  backupReimportFile: "api/backup/reimportfile",
  backupRemoveIgnored: "api/backup/delete-ignored",
  backupRemoveActive: "api/backup/delete-active-photos",
  backupImportPhotos: "api/backup/import-photos",
  backupDeleteConfirmedImports: "api/backup/delete-confirmed-imports",
  backupProcessFiles: "api/backup/importprocess",
  backupIgnoreFile: "api/backup/ignorefile",
  backupUnignoreFile: "api/backup/unignorefile",
  backupDeleteImportFile: "api/backup/delete-import-file",
  backupUpdateDestination: "api/backup/update-destination",
  backupRecipeFile: "api/backup/recipefile",
  backupSummary: "api/backup/summary",
  backupActions: "api/backup/actions",
  backupHierarchy: "api/backup/hierarchy",
  backupPrintSize: "api/backup/print-size",
  backupPrint: "api/backup/print",
  backupPrints: "api/backup/prints",
  backupRefreshFile: "api/backup/refresh-file-data"
};
