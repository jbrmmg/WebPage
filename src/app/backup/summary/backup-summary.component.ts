import {Component, OnInit} from "@angular/core";
import {BackupSummary} from "./backup-summary";
import {BackupService} from "../backup.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jbr-backup-summary',
    templateUrl: './backup-summary.component.html',
    styleUrls: ['./backup-summary.component.css']
})
export class BackupSummaryComponent implements OnInit  {
    public summary: BackupSummary;

    constructor(private readonly _backupService: BackupService,
                private datePipe: DatePipe) {
    }

    ngOnInit(): void {
        this._backupService.getSummary().subscribe(
            summary => {
                this.summary = summary;
            },
            () => console.log('Failed to get summary.'),
            () => console.log('Load Actions summary')
        );
    }

    get formattedDate() : string {
        if(this.summary.valid) {
            return this.datePipe.transform(this.summary.validAt,'dd MMMM yyyy hh:mm:ss');
        }

        return '';
    }
}
