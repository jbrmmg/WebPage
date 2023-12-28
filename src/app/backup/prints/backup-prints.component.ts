import {Component, OnInit, TemplateRef} from "@angular/core";
import {BackupService} from "../backup.service";
import {SelectedPrint} from "../backup-selectedprint";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
    selector: 'jbr-backup-prints',
    templateUrl: './backup-prints.component.html',
    styleUrls: ['./backup-prints.component.css']
})
export class BackupPrintsComponent implements OnInit {
    selectedPhotos: SelectedPrint[];
    printSizeModal: BsModalRef;
    rows: number[];
    cols: number[];

    constructor(private readonly _backupService: BackupService,
                private readonly _modalService: BsModalService) {
        this.cols = [0,1,2];
        this.selectedPhotos = [];
    }

    ngOnInit(): void {
        this._backupService.printsUpdated.subscribe(() => this.updatePrints());
        this._backupService.updatePrints();
    }

    updatePrints() {
        console.log('UPDATE THE PRINTS')
        this.selectedPhotos = this._backupService.getSelectedPhotos();

        let rowCount: number = this.selectedPhotos.length/3 + 1;
        this.rows = [rowCount];

        for(let i:number = 0; i < rowCount; i++) {
            this.rows[i] = i;
        }
    }

    private getIndex(row: number, col: number): number {
        return row * 3 + col;
    }

    imageUrl(row: number, col: number): string {
        return this._backupService.imageUrl(this.selectedPhotos[this.getIndex(row,col)].fileId);
    }

    printInfo(row: number, col: number): string {
        let text: string;
        let photo: SelectedPrint;

        photo = this.selectedPhotos[this.getIndex(row,col)];

        text = photo.sizeName;

        if(photo.blackWhite) {
            text = text + " - Black & White";
        } else {
            text = text + " - Colour";
        }

        if(photo.border) {
            text = text + " with border";
        }

        return text;
    }

    selectSize(row: number, col: number,template: TemplateRef<any>) {
        console.log("here - " + row + "," + col)
        this._modalService.show(template);
    }

    imageAvailable(row: number, col:number): boolean {
        if(this.selectedPhotos == null) {
            return false;
        }

        return this.getIndex(row,col) < this.selectedPhotos.length;
    }

    columns(): number {
        return 3;
    }

    unselect(row: number, col: number) {
        this._backupService.unselectForPrint(this.selectedPhotos[this.getIndex(row,col)].fileId);
    }

    clearPrints() {
        console.log('Clear')
        this._backupService.clearPrints();
    }

    close() {
        this._modalService.hide();
    }

    selectSizeAndStyle() {
        this._modalService.hide();
    }
}
