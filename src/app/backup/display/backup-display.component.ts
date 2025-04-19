import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {HierarchyResponse} from "../backup-hierarchyresponse";
import {FileInfoExtra} from "../backup-fileinfoextra";
import {BackupDisplayInfoComponent} from "./info/backup-display-info.component";
import {NgForOf, NgIf} from "@angular/common";
import {BackupDisplayLabelComponent} from "./label/backup-display-label.component";
import {BackupDisplayBackupsComponent} from "./backups/backups-list.components";
import {LatLong} from "../map/map-latlong";
import {BackupDisplayTitle} from "./title/backup-display-title";
import {BackupDisplayMedia} from "./media/backup-display-media";
import {BackupDisplayMetadata} from "./meta/backup-display-metadata";
import {BackupDisplayService} from "./backup-display-service";
import {BackupDisplayFiles} from "./files/backup-display-files";

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
export class BackupDisplayComponent implements OnInit  {
    hierarchy: HierarchyResponse[];
    fileList: HierarchyResponse[];
    initialHierarchy: HierarchyResponse;
    atTopLevel: boolean;
    selectedFile: FileInfoExtra;

    @Output() selectPhoto = new EventEmitter();

    constructor(private readonly _backupDisplayService: BackupDisplayService) {
    }

    ngOnInit(): void {
        this._backupDisplayService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
        this.initialHierarchy = new HierarchyResponse();
        this.initialHierarchy.id = -1;
        this.atTopLevel = true;
        this.selectedFile = null;

        this._backupDisplayService.getHierarchy(this.initialHierarchy).subscribe({
            next: hierarchy => {
                this.hierarchy = hierarchy
            },
            error: err => {
                console.log('Failed to get hierarchy ' + err);
            },
            complete: () => {
                console.log('Load hierarchy complete')
            }
        });
    }

    changeHierarchy(parent: HierarchyResponse): void {
        this.hierarchy = [];
        this.fileList = [];

        this.atTopLevel = parent.id === -1;

        let latLong: LatLong = new LatLong();
        latLong.lat = 51.60146388888889;
        latLong.long = -0.37789999999999996;

        this._backupDisplayService.getHierarchy(parent).subscribe({
            next: hierarchy => {
                this.hierarchy = hierarchy;
            },
            error: err => {
                console.log('Failed to get hierarchy' + err);
            },
            complete: () => {
                // Set the file list.
                if(this.hierarchy && this.hierarchy.length) {
                    this.hierarchy.forEach(h => {
                        if(!h.directory && !h.backup) {
                            this.fileList.push(h);
                        }
                    });

                    // Sort by date.
                    this.fileList.sort((h1, h2): number => {
                        const dateH1 = h1 && h1.dateTime ? new Date(h1.dateTime).getTime() : Infinity;
                        const dateH2 = h2 && h2.dateTime ? new Date(h2.dateTime).getTime() : Infinity;
                        return dateH1 - dateH2;
                    });
                }

                // If there are no files, then set the selected file to null.
                if(!this.fileList || !this.fileList.length) {
                    this.selectedFile = null;
                }

                console.log('Load hierarchy complete')
            }
        });
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file;
    }

    displayFile(file: HierarchyResponse): void {
        console.log(`Select file ${file.displayName}`);

        // Select a file.
        this._backupDisplayService.getFile(file.underlyingId);
    }

    displayPrevious() {
        // Display the previous file in the list by iterating through the list in reverse order.
        let displayNext = false;
        let selected = false;
        this.fileList.slice().reverse().forEach(nextFile => {
            if(nextFile.underlyingId == this.selectedFile.file.id) {
                displayNext = true;
            } else if(displayNext) {
                this.displayFile(nextFile);
                displayNext = false;
                selected = true;
                return;
            }
        });

        // If nothing selected then select the last file.
        if(!selected) {
            this.displayFile(this.fileList[this.fileList.length - 1]);
        }
    }

    displayNext() {
        // Display the next file in the list.
        let displayNext = false;
        let selected = false;
        this.fileList.forEach(nextFile => {
            if(nextFile.underlyingId == this.selectedFile.file.id) {
                displayNext = true;
            } else if(displayNext) {
                this.displayFile(nextFile);
                displayNext = false;
                selected = true;
                return;
            }
        });

        // If nothing selected then select the first file.
        if(!selected) {
            this.displayFile(this.fileList[0]);
        }
    }

    deleteFile() {
//        this._backupService.deleteFile(this.selectedFile.id);
    }

    refreshData() {
//        this._backupService.refreshFile(this.selectedFile.id);
    }

    selectPhotoMode() {
//        this._backupService.setSelectedPhoto(this.selectedFile.id,this.selectedFile.name);
        this.selectPhoto.emit();
    }

    getHeight(): number {
        return 420;
    }

    getWidth(): number {
        return 640;
    }
}
