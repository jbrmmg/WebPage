import {Component, EventEmitter, Input, Output} from "@angular/core";
import {SelectedPrint} from "../backup-selectedprint";
import {BackupService} from "../backup.service";

@Component({
    selector: 'jbr-backup-print-image',
    templateUrl: './backup-print-image.component.html',
    styleUrls: ['./backup-print-image.component.css']
})
export class BackupPrintImageComponent {
    @Input() selectedPrint: SelectedPrint;

    @Output() unselect: EventEmitter<SelectedPrint> = new EventEmitter<SelectedPrint>();
    @Output() updateSize: EventEmitter<SelectedPrint> = new EventEmitter<SelectedPrint>();

    constructor(private readonly _backupService: BackupService) {
    }

    unselectPrint():void {
        this.unselect.emit(this.selectedPrint);
    }

    selectSize(): void {
        this.updateSize.emit(this.selectedPrint);
    }

    imageUrl(): string {
        // Get the URL for this image.
        if (this.selectedPrint != null) {
            return this._backupService.imageUrl(this.selectedPrint.fileId);
        }

        return "";
    }

    fileName(): string {
        if(this.selectedPrint != null) {
            return this.selectedPrint.fileName;
        }

        return "";
    }

    printInfo(): string {
        if(this.selectedPrint != null) {
            let text: string;

            // Display the size and style selected.
            text = this.selectedPrint.sizeName;

            if(this.selectedPrint.blackWhite) {
                text = text + " - Black & White";
            } else {
                text = text + " - Colour";
            }

            if(this.selectedPrint.border) {
                text = text + " with border";
            }

            return text;
        }

        return "";
    }
}
