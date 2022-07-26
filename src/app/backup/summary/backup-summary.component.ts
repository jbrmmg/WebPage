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
        // Setup a blank summary before its initialised from the server.
        this.summary = new BackupSummary();
        this.summary.valid = false;
        this.summary.sources = [];
    }

    ngOnInit(): void {
        this._backupService.getSummary().subscribe(
            summary => {
                this.summary = summary;
            },
            () => console.log('Failed to get the Summary.'),
            () => console.log('Get Summary is complete.')
        );
    }

    get formattedDate() : string {
        if(this.summary.valid) {
            return this.datePipe.transform(this.summary.validAt,'dd MMMM yyyy HH:mm:ss');
        }

        return '';
    }
}
