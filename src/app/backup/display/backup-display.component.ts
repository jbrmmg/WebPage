import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HierarchyResponse} from '../backup-hierarchyresponse';
import {FileInfoExtra} from '../backup-fileinfoextra';
import {BackupDisplayInfoComponent} from './info/backup-display-info.component';
import {NgForOf, NgIf} from '@angular/common';
import {BackupDisplayLabelComponent} from './label/backup-display-label.component';
import {BackupDisplayBackupsComponent} from './backups/backups-list.components';
import {BackupDisplayTitle} from './title/backup-display-title';
import {BackupDisplayMedia} from './media/backup-display-media';
import {BackupDisplayMetadata} from './meta/backup-display-metadata';
import {BackupDisplayService} from './backup-display-service';
import {BackupDisplayFiles} from './files/backup-display-files';
import {BackupPrintService} from '../backup-print-service';

interface BreadcrumbItem {
    name: string;
    node: HierarchyResponse;
}

@Component({
    selector: 'jbr-backup-display',
    templateUrl: './backup-display.component.html',
    styleUrls: ['./backup-display.component.css'],
    standalone: true,
    imports: [
        BackupDisplayInfoComponent,
        BackupDisplayLabelComponent,
        BackupDisplayBackupsComponent,
        NgIf,
        NgForOf,
        BackupDisplayTitle,
        BackupDisplayMedia,
        BackupDisplayMetadata,
        BackupDisplayFiles
    ]
})
export class BackupDisplayComponent implements OnInit {
    hierarchy: HierarchyResponse[];
    fileList: HierarchyResponse[];
    initialHierarchy: HierarchyResponse;
    selectedFile: FileInfoExtra;
    zoom: number;
    breadcrumb: BreadcrumbItem[] = [];
    isMediaDirectory = false;

    @Output() selectPhoto = new EventEmitter();

    constructor(private readonly _backupDisplayService: BackupDisplayService,
                private readonly _backupPrintService: BackupPrintService) {}

    ngOnInit(): void {
        this._backupDisplayService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
        this.initialHierarchy = new HierarchyResponse();
        this.initialHierarchy.id = -1;
        this.selectedFile = null;
        this.zoom = 10;
        this.fetchHierarchy(this.initialHierarchy);
    }

    get atTopLevel(): boolean {
        return this.breadcrumb.length === 0;
    }

    private fetchHierarchy(parent: HierarchyResponse): void {
        this.hierarchy = [];
        this.fileList = [];
        this.selectedFile = null;
        this.isMediaDirectory = false;

        this._backupDisplayService.getHierarchy(parent).subscribe({
            next: hierarchy => { this.hierarchy = hierarchy; },
            error: err => { console.error('❌ Failed to get hierarchy:', err); },
            complete: () => {
                if (this.hierarchy?.length) {
                    this.fileList = this.hierarchy
                        .filter(h => !h.directory && !h.backup)
                        .sort((h1, h2) => {
                            const d1 = h1?.dateTime ? new Date(h1.dateTime).getTime() : Infinity;
                            const d2 = h2?.dateTime ? new Date(h2.dateTime).getTime() : Infinity;
                            return d1 - d2;
                        });
                }
                if (this.fileList?.length >= 1) {
                    this.displayFile(this.fileList[0]);
                }
            }
        });
    }

    changeHierarchy(item: HierarchyResponse): void {
        if (item.backup) {
            this.breadcrumb.pop();
        } else {
            this.breadcrumb.push({name: item.displayName, node: item});
        }
        this.fetchHierarchy(item);
    }

    navigateToRoot(): void {
        this.breadcrumb = [];
        this.fetchHierarchy(this.initialHierarchy);
    }

    navigateToBreadcrumb(index: number): void {
        const target = this.breadcrumb[index];
        this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        this.fetchHierarchy(target.node);
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file;
        this.isMediaDirectory = file.file.image || file.file.video;
    }

    displayFile(file: HierarchyResponse): void {
        this._backupDisplayService.getFile(file.underlyingId);
    }

    isFileSelected(file: HierarchyResponse): boolean {
        return this.selectedFile?.file?.id === file.underlyingId;
    }

    thumbnailUrl(fileId: number): string {
        return this._backupDisplayService.imageUrl(fileId);
    }

    onThumbnailError(event: Event): void {
        (event.target as HTMLImageElement).classList.add('thumbnail-missing');
    }

    displayPrevious(): void {
        let displayNext = false;
        let selected = false;
        this.fileList.slice().reverse().forEach(nextFile => {
            if (nextFile.underlyingId === this.selectedFile.file.id) {
                displayNext = true;
            } else if (displayNext && !selected) {
                this.displayFile(nextFile);
                displayNext = false;
                selected = true;
            }
        });
        if (!selected) { this.displayFile(this.fileList.at(-1)); }
    }

    displayNext(): void {
        let displayNext = false;
        let selected = false;
        this.fileList.forEach(nextFile => {
            if (nextFile.underlyingId === this.selectedFile.file.id) {
                displayNext = true;
            } else if (displayNext && !selected) {
                this.displayFile(nextFile);
                displayNext = false;
                selected = true;
            }
        });
        if (!selected) { this.displayFile(this.fileList[0]); }
    }

    deleteFile(): void { this._backupDisplayService.deleteFile(this.selectedFile.file.id); }
    refreshData(): void { this._backupDisplayService.refreshFile(this.selectedFile.file.id); }

    selectPhotoMode(): void {
        this._backupPrintService.setSelectedPhoto(this.selectedFile.file.id, this.selectedFile.file.name);
        this.selectPhoto.emit();
    }

    zoomIn(): void { this.zoom = Math.min(this.zoom + 10, 100); }
    zoomOut(): void { this.zoom = Math.max(this.zoom - 10, 10); }
}
