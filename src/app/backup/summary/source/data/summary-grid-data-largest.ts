import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";

@Component({
    selector: 'jbr-summary-grid-data-largest',
    templateUrl: './summary-grid-data-largest.html',
    styleUrls: ['./summary-grid-data-largest.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridDataLargest extends SummaryGridData {
    formattedSize() {
        // GB display.
        if(this.source.largestFile > 1000000000) {
            let gb: number = Number(this.source.largestFile);
            gb /= 1000000000;
            return gb.toFixed(2) + " GB";
        }

        // MB display.
        if(this.source.largestFile > 1000000) {
            let mb: number = Number(this.source.largestFile);
            mb /= 1000000;
            return mb.toFixed(2) + " MB";
        }

        // KB display
        if(this.source.largestFile > 1000) {
            let kb: number = Number(this.source.largestFile);
            kb /= 1000;
            return kb.toFixed(2) + " KB";
        }

        // Just display the size.
        return this.source.largestFile.toString();
    }

    getText(): string {
        if(this.source && this.source.largestFile > 0) {
            return this.formattedSize()
        }

        return "";
    }
}
