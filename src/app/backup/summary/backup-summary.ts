import {BackupSource} from "./backup-sources";
import {DatePipe} from "@angular/common";

export class BackupSummary {
    public valid: boolean;
    public validAt: Date;
    public sources: BackupSource[];
}
