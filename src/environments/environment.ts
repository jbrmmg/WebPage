// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Money URLs
  moneyTransactionUrlFormat: "api/money/transaction.##type##.json",
  moneyCategoryUrl: "api/money/category.json",
  moneyAccountUrl: "api/money/account.json",
  moneyAddUrl: "api/money/account.json",
  moneyTypeUrl: "api/money/types.json",
  moneyStatementUrl: "api/money/statements.json",
  moneyUpdateTransactionUrl: "api/money/update.json",
  moneyDeleteTransactionUrl: "api/money/update.json",
  moneyLockStatementUrl: "api/money/update.json",
  moneyReconcileTransactionUrl: "api/money/update.jso",
  moneyMatchUrl: "api/money/match.##accountId##.json",
  moneyClearDataUrl: "api/money/update.json",
  moneyAutoAcceptUrl: "api/money/update.json",
  moneySetCategoryUrl: "api/money/update.json",
  moneyGetRegularUrl: "api/money/regular.json",
  moneyGetFilesUrl: "api/money/reconcile.files.json",
  moneyLoadFileUrl: "api/money/reconcile.files.json",
  moneyAccountImage: "assets/images/account/##id##.svg`",
  moneyAccountDisabledImage: "assets/images/account/##id##x.svg`"
};
