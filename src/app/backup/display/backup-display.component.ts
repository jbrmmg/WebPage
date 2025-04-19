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
