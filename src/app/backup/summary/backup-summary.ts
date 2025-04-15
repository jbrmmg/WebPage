import {BackupSource} from "./backup-source";

export class BackupSummary {
    public valid: boolean;
    public validAt: Date;
    public sources: BackupSource[];
}
