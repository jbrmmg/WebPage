// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,

  money: {
    ...baseEnvironment.money,
    transaction: {
      ...baseEnvironment.money.transaction,
      listPage: "api/money/transaction.page.json",
      urlFormat: "api/money/transaction.##type##.json",
      add: "api/money/account.json",
      update: "api/money/update.json",
      delete: "api/money/update.json",
      regulars: "api/money/regular.json",
    },
    categories: "api/money/category.json",
    accounts: "api/money/account.json",
    statement: {
      ...baseEnvironment.money.statement,
      url: "api/money/statements.json",
      lock: "api/money/update.json",
    },
    reconcile: "api/money/update.json",
    match: "api/money/match.##accountId##.json",
    reconciliation: {
      ...baseEnvironment.money.reconciliation,
      clear: "api/money/update.json",
      auto: "api/money/update.json",
      update: "api/money/update.json",
      files: "api/money/reconcile.files.json",
      load: "api/money/reconcile.files.json",
    },
    account: {
      ...baseEnvironment.money.account,
      image: "assets/images/account/##id##.svg",
      disabledImage: "assets/images/account/##id##x.svg",
    },
    version: 'api/money/version.json',
    email: {
      ...baseEnvironment.money.email,
      reports: 'api/money/email.reports.json',
      url: 'api/money/update.json',
    },
  },

  backup: {
    ...baseEnvironment.backup,
    import: {
      ...baseEnvironment.backup.import,
      files: "api/backup/import-files",
      fileUpdates: "api/backup/file-updates",
      summaryUpdates: "api/backup/summary-updates",
      ignored: "api/backup/delete-ignored",
      activePhotos: "api/backup/delete-active-photos",
      photos: "api/backup/import-photos",
      confirmed: "api/backup/delete-confirmed-imports",
      data: "api/backup/delete-ignored",
      cache: "api/backup/delete-ignored",
      file: {
        ...baseEnvironment.backup.import.file,
        ignore: "api/backup/ignorefile",
        unIgnore: "api/backup/unignorefile",
        delete: "api/backup/delete-import-file",
        destination: "api/backup/update-destination",
        recipe: "api/backup/recipefile",
        backup: "api/backup/backupFile",
      },
    },
    summary: "api/backup/summary",
    actions: "api/backup/actions",
    hierarchy: "api/backup/hierarchy",
    prints: {
      ...baseEnvironment.backup.prints,
      sizes: "api/backup/print-size",
      url: "api/backup/prints",
      unselect: "api/backup/unprint",
    },
    files: {
      ...baseEnvironment.backup.files,
      refresh: "api/backup/refresh-file-data",
      expire: "api/backup/expire",
    },
    labels: "api/backup/labels",
    logs: "api/backup/log",
    jobs: "api/backup/jobs.json",
    search: "api/backup/search.json",
    classifications: "api/backup/classifications.json",
    hardware: "api/backup/hardware.json",
  },
};
