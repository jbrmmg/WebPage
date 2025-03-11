import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-status',
    templateUrl: './import-grid-data-status.html',
    styleUrls: ['./import-grid-data-status.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataStatus extends ImportGridData {

    getText(): string {
        if(this.file && this.file.source) {
            return this.file.source.size + "";
        }

        return "";
    }

    getClassFromStatus(status: string) : string {
        switch(status) {
            case "TL_RED":
                return "light redlight";
            case "TL_AMBER":
                return "light amberlight";
        }

        return "light greenlight";
    }

    duplicateStatus(): string {
        if(this.file && this.file.source) {
            return this.getClassFromStatus(this.file.source.duplicated)
        }

        return "light unknown";
    }

    importStatus(): string {
        if(this.file && this.file.source) {
            return this.getClassFromStatus(this.file.source.imported)
        }

        return "light unknown";
    }

    immediateImportStatus(): string {
        if(this.file && this.file.source) {
            return this.getClassFromStatus(this.file.source.immediateImported)
        }

        return "light unknown";
    }

    ignoreStatus(): string {
        if(this.file && this.file.source) {
            return this.getClassFromStatus(this.file.source.ignored)
        }

        return "light unknown";
    }

    statusText(): string {
        if(this.file && this.file.source) {
            return this.file.source.status;
        }

        return "";
    }

    displayStatus() {
        return this.file && this.file.similar == null
    }
}
