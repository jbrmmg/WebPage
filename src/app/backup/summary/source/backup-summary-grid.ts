import {Component, Input, OnChanges} from '@angular/core';
import {BackupSummaryService} from '../backup-summary-service';
import {SummaryGridHeaderPath} from './header/summary-grid-header-path';
import {SummaryGridHeaderStatus} from './header/summary-grid-header-status';
import {SummaryGridDataStatus} from './data/summary-grid-data-status';
import {SummaryGridDataPath} from './data/summary-grid-data-path';
import {BackupSummary} from '../backup-summary';
import {BackupSource} from '../backup-source';
import {NgForOf, NgIf} from '@angular/common';
import {SummaryGridHeaderLocation} from './header/summary-grid-header-location';
import {SummaryGridHeaderFiles} from './header/summary-grid-header-files';
import {SummaryGridHeaderDirectories} from './header/summary-grid-header-directories';
import {SummaryGridHeaderLargest} from './header/summary-grid-header-largest';
import {SummaryGridHeaderDestination} from './header/summary-grid-header-destination';
import {SummaryGridDataLocation} from './data/summary-grid-data-location';
import {SummaryGridDataFiles} from './data/summary-grid-data-files';
import {SummaryGridDataDirectories} from './data/summary-grid-data-directories';
import {SummaryGridDataLargest} from './data/summary-grid-data-largest';
import {SummaryGridDataDestination} from './data/summary-grid-data-destination';

export interface SourceGroup {
    label: string;
    sources: BackupSource[];
}

@Component({
    selector: 'jbr-summary-grid',
    templateUrl: './backup-summary-grid.html',
    styleUrls: ['./backup-summary-grid.css'],
    imports: [
        SummaryGridHeaderPath,
        SummaryGridHeaderStatus,
        SummaryGridHeaderFiles,
        SummaryGridHeaderLocation,
        SummaryGridHeaderDirectories,
        SummaryGridHeaderLargest,
        SummaryGridHeaderDestination,
        SummaryGridDataStatus,
        SummaryGridDataFiles,
        SummaryGridDataPath,
        SummaryGridDataLocation,
        SummaryGridDataDirectories,
        SummaryGridDataDestination,
        SummaryGridDataLargest,
        NgIf,
        NgForOf
    ],
    standalone: true
})
export class BackupSummaryGrid implements OnChanges {
    @Input() summary: BackupSummary;
    groups: SourceGroup[] = [];
    gatheringIds = new Set<number>();
    syncingIds = new Set<number>();

    constructor(private readonly _summaryService: BackupSummaryService) {}

    ngOnChanges(): void {
        if (this.summary?.sources?.length) {
            this.buildGroups();
        }
    }

    private buildGroups(): void {
        const sorted = [...this.summary.sources].sort((a, b): number => {
            const aImport = !a.group;
            const bImport = !b.group;
            if (aImport !== bImport) return aImport ? 1 : -1;
            const aGroup = a.group ?? '';
            const bGroup = b.group ?? '';
            if (aGroup !== bGroup) return aGroup < bGroup ? -1 : 1;
            if (a.primary !== b.primary) return a.primary ? -1 : 1;
            if (a.location.name !== b.location.name) return a.location.name > b.location.name ? 1 : -1;
            return a.path > b.path ? 1 : a.path < b.path ? -1 : 0;
        });

        const map = new Map<string, BackupSource[]>();
        sorted.forEach(s => {
            const key = s.group ?? 'IMPORT';
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(s);
        });

        this.groups = Array.from(map.entries()).map(([key, sources]) => ({
            label: key === 'IMPORT' ? 'Import Directories' : key,
            sources
        }));
    }

    triggerSync(source: BackupSource): void {
        if (this.syncingIds.has(source.syncId)) return;
        this.syncingIds.add(source.syncId);
        this._summaryService.runSync(source.syncId).subscribe({
            next: () => { this.syncingIds.delete(source.syncId); },
            error: () => { this.syncingIds.delete(source.syncId); }
        });
    }

    isSyncing(source: BackupSource): boolean {
        return this.syncingIds.has(source.syncId);
    }

    triggerGather(source: BackupSource): void {
        if (this.gatheringIds.has(source.id)) return;
        this.gatheringIds.add(source.id);
        this._summaryService.gather(source.id).subscribe({
            next: () => { this.gatheringIds.delete(source.id); },
            error: () => { this.gatheringIds.delete(source.id); }
        });
    }

    isGathering(source: BackupSource): boolean {
        return this.gatheringIds.has(source.id);
    }

    hasAnyDestination(): boolean {
        return this.summary?.sources?.some(s => !!s.destinationId) ?? false;
    }

    get colCount(): number {
        return this.hasAnyDestination() ? 9 : 8;
    }

    hasGatherData(source: BackupSource): boolean {
        return source.gatherStart != null;
    }

    gatherTimeDisplay(source: BackupSource): string {
        const start = this.timeOf(source.gatherStart);
        if (!source.gatherFinished) return `${start} → Running…`;
        const end = this.timeOf(source.gatherFinished);
        const duration = this.syncDuration(source.gatherStart, source.gatherFinished);
        return duration ? `${start} → ${end} (${duration})` : `${start} → ${end}`;
    }

    hasSyncData(source: BackupSource): boolean {
        return source.syncStartTime != null;
    }

    syncTimeDisplay(source: BackupSource): string {
        const start = this.timeOf(source.syncStartTime);
        if (!source.syncEndTime) return `${start} → Running…`;
        const end = this.timeOf(source.syncEndTime);
        const duration = this.syncDuration(source.syncStartTime, source.syncEndTime);
        return duration ? `${start} → ${end} (${duration})` : `${start} → ${end}`;
    }

    private timeOf(dt: string): string {
        return dt?.length >= 19 ? dt.substring(11, 19) : dt ?? '';
    }

    private syncDuration(start: string, end: string): string {
        const ms = new Date(end).getTime() - new Date(start).getTime();
        if (isNaN(ms) || ms < 0) return '';
        const secs = Math.round(ms / 1000);
        if (secs < 60) return `${secs}s`;
        const mins = Math.floor(secs / 60);
        const rem = secs % 60;
        return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
    }

    syncWarnClass(source: BackupSource): boolean {
        return (source.syncFilesWarned ?? 0) > 0;
    }
}
