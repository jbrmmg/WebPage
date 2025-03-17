export const environment = {
  production: true,

  // Money URLs
  moneyTransactionList: "money/transaction/list",
  moneyTransactionUrlFormat: "money/transaction?sortAscending=false&type=##type##[from][to][account][category]",
  moneyCategoryUrl: "money/categories",
  moneyAccountUrl: "money/accounts",
  moneyAddUrl: "money/transaction",
  moneyTypeUrl: "api/money/types.json",
  moneyStatementUrl: "money/statement",
  moneyUpdateTransactionUrl: "money/transaction",
  moneyDeleteTransactionUrl: "money/transaction",
  moneyLockStatementUrl: "money/statement/lock",
  moneyReconcileTransactionUrl: "money/reconcile",
  moneyMatchUrl: "money/match",
  moneyClearDataUrl: "money/reconciliation/clear",
  moneyAutoAcceptUrl: "money/reconciliation/auto",
  moneySetCategoryUrl: "money/reconciliation/update",
  moneyGetRegularUrl: "money/transaction/regulars",
  moneyGetFilesUrl: "money/reconciliation/files",
  moneyLoadFileUrl: "money/reconciliation/load",
  moneyAccountImage: "money/account/logo?disabled=false&id=##id##",
  moneyAccountDisabledImage: "money/account/logo?disabled=true&id=##id##",
  moneyFileUpdates: "money/reconciliation/file-updates",

  // Backup URLs
  backupGetPreImportFiles: "backup/preimportfiles",
  backupDeletePreImportFile: "backup/preimportfile",
  backupFileUpdates: "backup/file-updates",
  backupReimportFile: "backup/reimportfile",
  backupRemoveIgnored: "backup/removeignored",
  backupImportFiles: "backup/importfiles",
  backupRemoveDuplicates: "backup/removeduplicates",
  backupProcessFiles: "backup/importprocess",
  backupIgnoreFile: "backup/ignorefile",
  backupRecipeFile: "backup/recipefile"
};
