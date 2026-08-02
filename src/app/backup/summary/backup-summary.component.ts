import {Component, OnInit} from '@angular/core';
import {BackupSummary} from './backup-summary';
import {DatePipe} from '@angular/common';
import {BackupSummaryService} from './backup-summary-service';

@Component({
    selector: 'jbr-backup-summary',
    templateUrl: './backup-summary.component.html',
    styleUrls: ['./backup-summary.component.css']
})
export class BackupSummaryComponent implements OnInit {
    public summary: BackupSummary;

    constructor(private readonly _backupSummaryService: BackupSummaryService,
                private datePipe: DatePipe) {
        this.summary = new BackupSummary();
        this.summary.valid = false;
        this.summary.sources = [];
    }

    ngOnInit(): void {
        this.loadSummary();
    }

    refresh(): void {
        this.summary = new BackupSummary();
        this.summary.valid = false;
        this.summary.sources = [];
        this.loadSummary();
    }

    private loadSummary(): void {
        this._backupSummaryService.getSummary().subscribe({
            next: val => { this.summary = val; },
            error: err => { console.error('❌', err); }
        });
    }

    get formattedDate(): string {
        if (this.summary.valid) {
            return this.datePipe.transform(this.summary.validAt, 'dd MMMM yyyy HH:mm:ss') + ' (' + this.summary.version + ')';
        }
        return '';
    }
}
