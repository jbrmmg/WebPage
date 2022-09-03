import {Component, Input} from "@angular/core";
import {BackupSource} from "../backup-sources";
import {BackupSummary} from "../backup-summary";

@Component({
    selector: 'jbr-backup-summary-source',
    templateUrl: './backup-summary-source.component.html',
    styleUrls: ['./backup-summary-source.component.css']
})
export class BackupSummarySourceComponent {
    @Input() source: BackupSource;
    @Input() summary: BackupSummary;

    // Is the status OK?
    public isOK(): boolean {
        if(this.source.status != null) {
            if(this.source.status === "OK") {
                return true;
            }
        }

        return false;
    }

    // Indicate if the source has any file.
    public hasFiles(): boolean {
        return this.source.fileCount > 0;
    }

    // Indicate if the source has a filter.
    public hasFilter(): boolean {
        return this.source.filter != null;
    }

    // Get the display string for the largest file.
    public largest(): string {
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

    // Get the title.
    public title(): string {
        switch(this.source.type) {
            case "SRCE":
                return "Source";
            case "PIMP":
                return "Pre-Import";
        }

        return "Import";
    }

    // Get the formatted file count display.
    public formattedFileCount(): string {
        if(this.source.fileCount > 0) {
            if(this.source.directoryCount > 0) {
                return this.source.fileCount + " (" + this.source.directoryCount + " directories)";
            }

            return this.source.fileCount.toString();
        }

        return "";
    }

    // Indicate if the source has a destination.
    public hasDestination(): boolean {
        return this.source.type === "IMPS";
    }

    // Get the destination string (only applies to import).
    public destination(): string {
        let result: string;

        this.summary.sources.forEach(nextSource => {
            console.log(nextSource.id + ":" + this.source.destinationId);
            if(this.source.destinationId === nextSource.id) {
                result = nextSource.path + " (" + nextSource.location.name + ")";
            }
        })

        return result;
    }
}
