import { baseEnvironment } from './environment.base';

export const environment = {
    ...baseEnvironment,
    production: true,

    backup: {
        ...baseEnvironment.backup,
        import: {
            ...baseEnvironment.backup.import,
            summaryUpdates: "api/backup/summary-updates.json",
            mockSummaryUpdates: true,
        },
    },
};
