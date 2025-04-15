import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";
import {DecimalPipe, NgIf} from "@angular/common";

@Component({
    selector: 'jbr-summary-grid-data-files',
    templateUrl: './summary-grid-data-files.html',
    styleUrls: ['./summary-grid-data-files.css'],
    imports: [
        DecimalPipe,
        NgIf
    ],
    standalone: true
})
export class SummaryGridDataFiles extends SummaryGridData {
    getText(): string {
        return "";
    }

    hasValue(): boolean {
        return this.source && this.source.fileCount > 0;
    }

    getFiles(): number {
        if(this.source && this.source.fileCount > 0) {
            return this.source.fileCount;
        }

        return 0;
    }
}
