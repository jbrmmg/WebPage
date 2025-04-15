import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";
import {DecimalPipe, NgIf} from "@angular/common";

@Component({
    selector: 'jbr-summary-grid-data-directories',
    templateUrl: './summary-grid-data-directories.html',
    styleUrls: ['./summary-grid-data.css'],
    imports: [
        DecimalPipe,
        NgIf
    ],
    standalone: true
})
export class SummaryGridDataDirectories extends SummaryGridData {
    getText(): string {
        return "";
    }

    hasValue(): boolean {
        return this.source && this.source.directoryCount > 0;
    }

    getDirectories(): number {
        if(this.source && this.source.directoryCount > 0) {
            return this.source.directoryCount;
        }

        return 0;
    }
}
