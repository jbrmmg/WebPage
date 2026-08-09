export interface BackupJob {
    backupId: string;
    startedAt: string;
    finishedAt: string;
    status: 'RUNNING' | 'SUCCESS' | 'SKIPPED' | 'FAILED';
    message: string;
}
