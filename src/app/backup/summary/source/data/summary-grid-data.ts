import {Component, Input} from "@angular/core";
import {BackupSource} from "../../backup-sources";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class SummaryGridData {
    @Input() source: BackupSource;

    abstract getText(): string;
}
