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
    @Input() type: TrafficLightType;
    @Output() filterChange: EventEmitter<ImportGridTrafficLightFilter> = new EventEmitter();

    filterValue: ImportGridTrafficLightFilter;

    protected readonly TrafficLightStatus = TrafficLightStatus;

    ngOnInit(): void {
        this.filterValue = new ImportGridTrafficLightFilter();
    }

    getText(): string {
        return ImportGridTrafficLight.getShortHeaderTitle(this.type);
    }

    getTitle(): string {
        return ImportGridTrafficLight.getHeaderTitle(this.type);
    }

    filterStatus(type: TrafficLightStatus) {
        switch (type) {
            case TrafficLightStatus.Red:
                return this.filterValue.red ? "light red-light" : "light off-light";
            case TrafficLightStatus.Amber:
                return this.filterValue.amber ? "light amber-light" : "light off-light";
            case TrafficLightStatus.Green:
                return this.filterValue.green ? "light green-light" : "light off-light";
        }

        return this.filterValue.unknown ? "light unknown-light" : "light off-light";
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
        this.filterValue.type = this.type;
        this.filterChange.emit(this.filterValue);
    }
}
