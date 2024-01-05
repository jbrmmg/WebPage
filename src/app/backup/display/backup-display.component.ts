import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {BackupService} from "../backup.service";
import {HierarchyResponse} from "../backup-hierarchyresponse";
import {FileInfo} from "../backup-fileinfo";
import {FileInfoExtra} from "../backup-fileinfoextra";

@Component({
    selector: 'jbr-backup-display',
    templateUrl: './backup-display.component.html',
    styleUrls: ['./backup-display.component.css']
})
export class BackupDisplayComponent implements OnInit  {
    hierarchy: HierarchyResponse[];
    initialHierarchy: HierarchyResponse;
    atTopLevel: boolean;
    selectedFile: FileInfo;

    @Output() selectPhoto = new EventEmitter();

    constructor(private readonly _backupService: BackupService) {
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
        this.initialHierarchy = new HierarchyResponse();
        this.initialHierarchy.id = -1;
        this.atTopLevel = true;
        this.selectedFile = null;

        this._backupService.getHierarchy(this.initialHierarchy).subscribe(
            hierarchy => {
                this.hierarchy = hierarchy;
            },
            () => console.log('Failed to get hierarchy'),
            () => console.log('Load hierarchy complete')
        );
    }

    changeHierarchy(parent: HierarchyResponse): void {
        this.hierarchy = [];

        this.atTopLevel = parent.id === -1;

        this._backupService.getHierarchy(parent).subscribe(
            hierarchy => {
                this.hierarchy = hierarchy;
            },
            () => console.log('Failed to get hierarchy'),
            () => console.log('Load hierarchy complete')
        );
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file.file;
    }

    displayFile(file: HierarchyResponse): void {
        console.log(`Select file ${file.displayName}`);

        // Select file.
        this._backupService.getFile(file.underlyingId);
    }

    imageUrl(id: number): string {
        return this._backupService.imageUrl(id);
    }

    videoUrl(id: number): string {
        return this._backupService.videoUrl(id);
    }

    deleteFile() {
        this._backupService.deleteFile(this.selectedFile.id);
    }

    selectPhotoMode() {
        this._backupService.setSelectedPhoto(this.selectedFile.id,this.selectedFile.name);
        this.selectPhoto.emit();
    }
}
