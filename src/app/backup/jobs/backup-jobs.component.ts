import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BackupJob} from '../backup-job';
import {BackupJobsService} from './backup-jobs.service';

@Component({
    selector: 'jbr-backup-jobs',
    templateUrl: './backup-jobs.component.html',
    styleUrls: ['./backup-jobs.component.css']
})
export class BackupJobsComponent implements OnInit {
    jobs: BackupJob[] = [];
    selectedDay = '';
    days: string[] = [];

    constructor(private readonly _backupJobsService: BackupJobsService,
                private readonly datePipe: DatePipe) {}

    ngOnInit(): void {
        this._backupJobsService.getJobs().subscribe({
            next: jobs => {
                this.jobs = jobs;
                this.days = this.extractDays(jobs);
                this.selectedDay = this.days[0] ?? '';
            },
            error: err => console.error('❌ Failed to load jobs:', err)
        });
    }

    private extractDays(jobs: BackupJob[]): string[] {
        const set = new Set(jobs.map(j => j.startedAt.substring(0, 10)));
        return Array.from(set).sort().reverse();
    }

    get jobsForDay(): BackupJob[] {
        return this.jobs
            .filter(j => j.startedAt.startsWith(this.selectedDay))
            .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    }

    selectDay(day: string): void {
        this.selectedDay = day;
    }

    formatDayTab(day: string): string {
        return this.datePipe.transform(day, 'dd MMM yyyy') ?? day;
    }

    formatTime(dt: string): string {
        return this.datePipe.transform(dt, 'HH:mm:ss') ?? dt;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'SUCCESS': return 'status-success';
            case 'RUNNING': return 'status-running';
            case 'SKIPPED': return 'status-skipped';
            case 'FAILED':  return 'status-failed';
            default:        return '';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'SUCCESS': return 'fa fa-check-circle';
            case 'RUNNING': return 'fa fa-spinner fa-spin';
            case 'SKIPPED': return 'fa fa-minus-circle';
            case 'FAILED':  return 'fa fa-times-circle';
            default:        return 'fa fa-question-circle-o';
        }
    }
}
