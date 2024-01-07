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
    selectedSizeName: string;
    selectedSizeId: number;
    border: boolean;
    blackAndWhite: boolean;

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
        this.border = this.selectedPrint.border;
        this.blackAndWhite = this.selectedPrint.blackWhite;
        this.selectedSizeName = this.selectedPrint.sizeName;
        this.selectedSizeId = this.selectedPrint.sizeId;

        // Populate the combo values.
        this._backupService.getPrintSizes().subscribe(sizes => {
            this.sizes = [];

            sizes.forEach(nextSize => {
                this.sizes.push(nextSize);

                // If no size is set then choose the size that starts "6x4".
                if((this.selectedSizeName == null) && (this.selectedSizeId == null)) {
                    if(nextSize.name.startsWith("6x4 in")) {
                        this.selectedSizeId = nextSize.id;
                        this.selectedSizeName = nextSize.name;
                        if(this.selectedPrint != null) {
                            this.selectedPrint.sizeName = this.selectedSizeName;
                        }
                    }
                }
            });
        });
    }

    close() {
        // Indicate nothing selected.
        this.sizeChange.emit(null);
    }

    changeSize(size: string) {
        this.selectedSizeName = size;

        this.sizes.forEach(nextSize => {
            if(nextSize.name == size) {
                this.selectedSizeId = nextSize.id;
            }
        })

        console.log("Size selected " + this.selectedSizeName + " " + this.selectedSizeId);
    }

    selectSizeAndStyle() {
        let selection: SelectedPrint = new SelectedPrint();

        selection.fileId = this.selectedPrint.fileId;
        selection.sizeId = this.selectedSizeId;
        selection.sizeName = this.selectedSizeName;
        selection.border = this.border;
        selection.blackWhite = this.blackAndWhite;

        // Fire the change to the parent.
        this.sizeChange.emit(selection);
    }
}
