import {Component, OnInit} from '@angular/core';
import {Log} from '../backup-log';
import {DatePipe} from '@angular/common';
import {BackupLogService} from './backup-log-service';

@Component({
    selector: 'jbr-backup-log',
    templateUrl: './backup-log.component.html',
    styleUrls: ['./backup-log.component.css']
})
export class BackupLogComponent implements OnInit {
    logs: Log[];

    constructor(private readonly _backupLogService: BackupLogService,
                private readonly datePipe: DatePipe) {
    }

    ngOnInit(): void {
        console.log('📋 Get Log.');
        this.logs = [];

        this._backupLogService.getLogs().subscribe({
            next: logs => {
                logs.forEach(nextLog => {
                    this.logs.push(nextLog);
                });
            },
            error: err => { console.error('❌ Failed to load log:', err); },
            complete: () => { console.log('✅ Load Logs Complete'); }
        });
    }

    getLogDate(log: Log): string {
        return this.datePipe.transform(log.date, 'ddMMM HH:mm:ss');
    }

    getLogIconClass(log: Log): string {
        switch (log.type) {
            case 'Debug':
                return 'col-1 icon-col fa fa-info-circle icon-debug';
            case 'Info':
                return 'col-1 icon-col fa fa-info-circle icon-info';
            case 'Warning':
                return 'col-1 icon-col fa fa-exclamation-triangle icon-warning';
            case 'Error':
                return 'col-1 icon-col fa fa-exclamation-circle icon-error';
        }

        return 'col-1 icon-col fa fa-question-circle-o';
    }
}
