import {Component, OnInit, TemplateRef} from "@angular/core";
import {SelectedPrint} from "../backup-selectedprint";
import {BsModalService} from "ngx-bootstrap/modal";
import {BackupPrintService} from "../backup-print-service";

@Component({
    selector: 'jbr-backup-prints',
    templateUrl: './backup-prints.component.html',
    styleUrls: ['./backup-prints.component.css']
})
export class BackupPrintsComponent implements OnInit {
    selectedPhotos: SelectedPrint[];
    sizePhoto: SelectedPrint;
    rows: number[];
    cols: number[];

    constructor(private readonly _backupPrintService: BackupPrintService,
                private readonly _modalService: BsModalService) {
        this.cols = [0,1,2];
        this.selectedPhotos = [];
        this.sizePhoto = null;
    }

    ngOnInit(): void {
        this._backupPrintService.printsUpdated.subscribe(() => this.updatePrints());
        this._backupPrintService.updatePrints();
    }

    updatePrints() {
        this.selectedPhotos = this._backupPrintService.getSelectedPhotos();

        let rowCount: number = this.selectedPhotos.length/this.columns() + 1;
        this.rows = [rowCount];

        for(let i:number = 0; i < rowCount; i++) {
            this.rows[i] = i;
        }
    }

    unselectPrint(print: SelectedPrint) {
        this._backupPrintService.unselectForPrint(print.fileId);
    }

    updatePrintSize(print: SelectedPrint, template: TemplateRef<any>) {
        // Store the selected print and show the dialog.
        this.sizePhoto = print;
        this._modalService.show(template);
    }

    getPrintAtRowCol(row: number, col: number): SelectedPrint {
        if(this.selectedPhotos == null) {
            return null;
        }

        let index: number = this.getIndex(row,col);

        if(index < this.selectedPhotos.length) {
            return this.selectedPhotos[index];
        }

        // No selection at this co-ordinate.
        return null;
    }

    private getIndex(row: number, col: number): number {
        return row * this.columns() + col;
    }

    columns(): number {
        return this.cols.length;
    }

    clearPrints() {
        console.log('Clear')
        this._backupPrintService.clearPrints();
    }

    onSizeChange(selection: SelectedPrint) {
        this._modalService.hide();

        if(selection != null) {
            this._backupPrintService.updatedPrint(selection);
        }
    }
}
