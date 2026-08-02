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
    logs: Log[] = [];
    showDebug = true;
    showInfo = true;
    showWarning = true;
    showError = true;

    constructor(private readonly _backupLogService: BackupLogService,
                private readonly datePipe: DatePipe) {}

    ngOnInit(): void {
        this._backupLogService.getLogs().subscribe({
            next: logs => { this.logs = logs; },
            error: err => { console.error('❌ Failed to load log:', err); },
            complete: () => { console.log('✅ Load Logs Complete'); }
        });
    }

    toggleFilter(level: string): void {
        switch (level) {
            case 'Debug':   this.showDebug   = !this.showDebug;   break;
            case 'Info':    this.showInfo    = !this.showInfo;    break;
            case 'Warning': this.showWarning = !this.showWarning; break;
            case 'Error':   this.showError   = !this.showError;   break;
        }
    }

    get filteredLogs(): Log[] {
        return this.logs.filter(log => {
            switch (log.type) {
                case 'Debug':   return this.showDebug;
                case 'Info':    return this.showInfo;
                case 'Warning': return this.showWarning;
                case 'Error':   return this.showError;
                default:        return true;
            }
        });
    }

    getLogDate(log: Log): string {
        return this.datePipe.transform(log.date, 'dd MMM HH:mm:ss');
    }

    getRowClass(log: Log): string {
        switch (log.type) {
            case 'Warning': return 'row-warning';
            case 'Error':   return 'row-error';
            default:        return '';
        }
    }

    getLogIconClass(log: Log): string {
        switch (log.type) {
            case 'Debug':   return 'col-1 icon-col fa fa-info-circle icon-debug';
            case 'Info':    return 'col-1 icon-col fa fa-info-circle icon-info';
            case 'Warning': return 'col-1 icon-col fa fa-exclamation-triangle icon-warning';
            case 'Error':   return 'col-1 icon-col fa fa-exclamation-circle icon-error';
            default:        return 'col-1 icon-col fa fa-question-circle-o';
        }
    }
}
