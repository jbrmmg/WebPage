import {Component, Input, OnInit} from "@angular/core";
import {BackupSource} from "../backup-sources";

@Component({
    selector: 'jbr-backup-summary-source',
    templateUrl: './backup-summary-source.component.html',
    styleUrls: ['./backup-summary-source.component.css']
})
export class BackupSummarySourceComponent {
    @Input() source: BackupSource;
}
