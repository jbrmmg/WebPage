import {Component, Input, OnChanges} from '@angular/core';
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

const IMPORT_TYPES = ['IMPS', 'PIMP', 'POSP'];

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

    ngOnChanges(): void {
        if (this.summary?.sources?.length) {
            this.buildGroups();
        }
    }

    private pathSuffix(path: string): string {
        const parts = path.split('/');
        return parts[parts.length - 1] || path;
    }

    private groupKey(source: BackupSource): string {
        if (source.type === 'SRCE') return 'SRCE:' + this.pathSuffix(source.path);
        if (IMPORT_TYPES.includes(source.type)) return 'IMPORT';
        return source.type;
    }

    private groupLabel(key: string): string {
        if (key.startsWith('SRCE:')) return key.substring(5);
        if (key === 'IMPORT') return 'Import Directories';
        return key;
    }

    private buildGroups(): void {
        const sorted = [...this.summary.sources].sort((a, b): number => {
            if (a.fileCount !== b.fileCount) return a.fileCount < b.fileCount ? 1 : -1;
            if (a.location.name !== b.location.name) return a.location.name > b.location.name ? 1 : -1;
            if (a.path > b.path) return 1;
            if (a.path < b.path) return -1;
            return 0;
        });

        const map = new Map<string, BackupSource[]>();
        sorted.forEach(s => {
            const key = this.groupKey(s);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(s);
        });

        this.groups = Array.from(map.entries()).map(([key, sources]) => ({
            label: this.groupLabel(key),
            sources
        }));
    }

    hasAnyDestination(): boolean {
        return this.summary?.sources?.some(s => !!s.destinationId) ?? false;
    }
}
