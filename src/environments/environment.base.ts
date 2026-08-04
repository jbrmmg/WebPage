export const baseEnvironment = {
  production: false,

  money: {
    transaction: {
      listPage: "money/transaction/list/page",
      urlFormat: "money/transaction?sortAscending=false&type=##type##[from][to][account][category]",
      add: "money/transaction",
      update: "money/transaction",
      delete: "money/transaction",
      regulars: "money/transaction/regulars",
    },
    categories: "money/categories",
    accounts: "money/accounts",
    statement: {
      url: "money/statement",
      lock: "money/statement/lock",
    },
    reconcile: "money/reconcile",
    match: "money/match",
    reconciliation: {
      clear: "money/reconciliation/clear",
      auto: "money/reconciliation/auto",
      update: "money/reconciliation/update",
      files: "money/reconciliation/files",
      load: "money/reconciliation/load",
      fileUpdates: "money/reconciliation/file-updates",
    },
    account: {
      image: "money/account/logo?disabled=false&id=##id##",
      disabledImage: "money/account/logo?disabled=true&id=##id##",
    },
    version: 'money/version',
    email: {
      reports: 'money/email/reports',
      url: 'money/email',
    },
    typeUrl: "api/money/types.json",
  },

  backup: {
    import: {
      files: "backup/import/files",
      fileUpdates: "backup/import/events/files",
      summaryUpdates: "backup/import/events/summary",
      mockSummaryUpdates: false,
      ignored: "backup/import/ignored",
      activePhotos: "backup/import/active-photos",
      photos: "backup/import/photos",
      confirmed: "backup/import/confirmed",
      file: {
        ignore: "backup/import/file/ignore",
        unIgnore: "backup/import/file/un-ignore",
        delete: "backup/import/file",
        destination: "backup/import/file/destination",
        recipe: "backup/import/file/recipe",
        backup: "backup/import/file/backup",
      },
    },
    summary: "backup/summary",
    actions: "backup/actions",
    hierarchy: "backup/hierarchy",
    prints: {
      sizes: "backup/prints/sizes",
      url: "backup/prints",
      unselect: "backup/prints/unselect",
    },
    files: {
      refresh: "backup/files/refresh?id=##id##",
      expire: "backup/files/expire",
    },
    labels: "backup/labels",
    logs: "backup/logs",
  },
};