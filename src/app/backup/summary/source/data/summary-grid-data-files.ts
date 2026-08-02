import {Component} from '@angular/core';
import {SummaryGridData} from './summary-grid-data';
import {DecimalPipe, NgIf} from '@angular/common';
import {BackupSource} from '../../backup-source';

const IMPORT_TYPES = ['IMPS', 'PIMP', 'POSP'];

@Component({
    selector: 'jbr-summary-grid-data-files',
    templateUrl: './summary-grid-data-files.html',
    styleUrls: ['./summary-grid-data.css'],
    imports: [DecimalPipe, NgIf],
    standalone: true
})
export class SummaryGridDataFiles extends SummaryGridData {
    getText(): string { return ''; }

    hasValue(): boolean {
        return this.source?.fileCount > 0;
    }

    getFiles(): number {
        return this.source?.fileCount ?? 0;
    }

    private pathSuffix(path: string): string {
        const parts = path.split('/');
        return parts[parts.length - 1] || path;
    }

    private destinationPeers(): BackupSource[] {
        if (!this.summary?.sources || this.source?.type !== 'SRCE' || this.source?.primary) return [];
        const suffix = this.pathSuffix(this.source.path);
        return this.summary.sources.filter(s =>
            s.type === 'SRCE' && !s.primary && this.pathSuffix(s.path) === suffix
        );
    }

    isSyncOk(): boolean {
        const peers = this.destinationPeers();
        return peers.length >= 2 && peers.every(s => s.fileCount === peers[0].fileCount);
    }

    isSyncMismatch(): boolean {
        const peers = this.destinationPeers();
        return peers.length >= 2 && !peers.every(s => s.fileCount === peers[0].fileCount);
    }

    isImportActive(): boolean {
        return IMPORT_TYPES.includes(this.source?.type) && this.source?.fileCount > 0;
    }
}
