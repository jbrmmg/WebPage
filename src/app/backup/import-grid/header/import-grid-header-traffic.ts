import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";
import {ImportGridTrafficLightFilter} from "../traffic/import-grid-traffic-light";

@Component({
    selector: 'jbr-import-grid-header-traffic',
    templateUrl: './import-grid-header-traffic.html',
    styleUrls: ['./import-grid-header-traffic.css'],
    imports: [],
    standalone: true
})
export class ImportGridHeaderTraffic extends ImportGridHeader implements OnInit {
    @Output() filterChange: EventEmitter<ImportGridTrafficLightFilter> = new EventEmitter();

    filterValue: ImportGridTrafficLightFilter;

    ngOnInit(): void {
        this.filterValue = new ImportGridTrafficLightFilter();
    }

    getText(): string {
        return "Status";
    }
}
