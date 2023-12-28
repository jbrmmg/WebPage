import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PrintSize, SelectedPrint} from "../backup-selectedprint";
import {BackupService} from "../backup.service";

@Component({
    selector: 'jbr-backup-print-size-selector',
    templateUrl: './backup-print-size-select.component.html',
    styleUrls: ['./backup-print-size-select.component.css']
})
export class BackupPrintSizeSelectComponent implements OnInit {
    @Input() selectedPrint: SelectedPrint;

    @Output() sizeChange: EventEmitter<SelectedPrint> = new EventEmitter();

    sizes: PrintSize[];

    constructor(private readonly _backupService: BackupService) {
    }

    isSelected(sizeName: string): string {
        if(this.selectedPrint != null) {
            if(this.selectedPrint.sizeName == sizeName) {
                return "selected";
            }
        }

        return "";
    }

    ngOnInit(): void {
        // Populate the combo values.
        this._backupService.getPrintSizes().subscribe(sizes => {
            this.sizes = [];

            sizes.forEach(nextSize => {
                this.sizes.push(nextSize);
            });
        });
    }

    close() {
        // Indicate nothing selected.
        this.sizeChange.emit(null);
    }

    selectSizeAndStyle() {
        let selection: SelectedPrint = new SelectedPrint();

        selection.fileId = this.selectedPrint.fileId;
        selection.sizeId = 0;  // TODO - get the size id
        selection.sizeName = "what?" // TODO - get the size name
        selection.border = false;   // TODO get the border
        selection.blackWhite = false; // TODO get the blank & white flag.

        // Fire the change to the parent.
        this.sizeChange.emit(selection);
    }
}
