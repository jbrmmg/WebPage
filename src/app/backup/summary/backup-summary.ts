import {BackupSource} from "./backup-sources";

export class BackupSummary {
    public valid: boolean;
    public validAt: Date;
    public sources: BackupSource[];
}
