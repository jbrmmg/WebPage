import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";
import {DecimalPipe, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'jbr-action-data-media',
    templateUrl: './action-grid-data-media.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
        NgIf,
        NgOptimizedImage,
        DecimalPipe
    ],
    standalone: true
})
export class ActionGridDataMedia extends ActionGridData {
    getDateText() {
        let dateString: string = "" + this.action.fileDate;

        if(this.action && this.action.fileDate) {
            return "" + dateString.replace("T"," ");
        }

        return "";
    }

    displaySize(): boolean {
        return !!(this.action && this.action.fileSize);
    }

    getSize() {
        if(this.action && this.action.fileSize) {
            return this.action.fileSize;
        }
    }

    getFileId(): number {
        if(this.action && this.action.fileId) {
            return this.action.fileId;
        }

        return null;
    }

    isImage(): boolean {
        if(this.action && this.action.isImage) {
            return this.action.isImage;
        }

        return false;
    }

    isVideo(): boolean {
        if(this.action && this.action.isVideo) {
            return this.action.isVideo;
        }

        return false;
    }

    getText(): string {
        if(this.action && this.action.isImage) {
            return "" + this.action.isImage;
        }

        return "";
    }
}
