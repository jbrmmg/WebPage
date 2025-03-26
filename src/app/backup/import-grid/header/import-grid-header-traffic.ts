import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";
import {
    ImportGridTrafficLight,
    ImportGridTrafficLightFilter,
    TrafficLightStatus,
    TrafficLightType
} from "../traffic/import-grid-traffic-light";

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

    protected readonly TrafficLightStatus = TrafficLightStatus;

    ngOnInit(): void {
        this.filterValue = new ImportGridTrafficLightFilter();
    }

    getText(): string {
        return "Status";
    }

    filter(type: TrafficLightStatus): void {
        switch (type) {
            case TrafficLightStatus.Red:
                this.filterValue.red = !this.filterValue.red;
                break;
            case TrafficLightStatus.Amber:
                this.filterValue.amber = !this.filterValue.amber;
                break;
            case TrafficLightStatus.Green:
                this.filterValue.green = !this.filterValue.green;
                break;
            case TrafficLightStatus.Unknown:
                this.filterValue.unknown = !this.filterValue.unknown;
                break;
        }

        // Fire the event.
        this.filterChange.emit(this.filterValue);
    }
}
