import {Component, OnInit} from "@angular/core";
import {BackupService} from "../backup.service";

@Component({
    selector: 'jbr-backup-prints',
    templateUrl: './backup-prints.component.html',
    styleUrls: ['./backup-prints.component.css']
})
export class BackupPrintsComponent implements OnInit {
    selectedPhotos: number[];
    rows: number[];
    cols: number[];

    constructor(private readonly _backupService: BackupService) {
        this.cols = [0,1,2,3,4];
        this.selectedPhotos = [];
    }

    ngOnInit(): void {
        this._backupService.printsUpdated.subscribe(() => this.updatePrints());
        this._backupService.updatePrints();
    }

    updatePrints() {
        console.log('UPDATE THE PRINGS')
        this.selectedPhotos = this._backupService.getSelectedPhotos();
        if(this.selectedPhotos == null) {
            console.log('empty');
        }
        this.rows = [0,1];
    }

    private getIndex(row: number, col: number): number {
        return row * 5 + col;
    }

    imageUrl(row: number, col: number): string {
        return this._backupService.imageUrl(this.selectedPhotos[this.getIndex(row,col)]);
    }

    imageAvailable(row: number, col:number): boolean {
        if(this.selectedPhotos == null) {
            return false;
        }

        console.log('R' + row + ' C' + col)
        return this.getIndex(row,col) < this.selectedPhotos.length;
    }

    columns(): number {
        return 5;
    }

    unselect(row: number, col: number) {
        this._backupService.unselectForPrint(this.selectedPhotos[this.getIndex(row,col)]);
    }

    clearPrints() {
        console.log('Clear')
        this._backupService.clearPrints();
    }
}
