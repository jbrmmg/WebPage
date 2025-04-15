import {Component, Input} from "@angular/core";
import {BackupSource} from "../../backup-source";
import {BackupSummary} from "../../backup-summary";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class SummaryGridData {
    @Input() source: BackupSource;
    @Input() summary: BackupSummary;

    abstract getText(): string;

    statusClass() {
        if(this.source && this.source.status && this.source.status == "OK") {
            return "ok";
        }

        return "ok";
    }
}
