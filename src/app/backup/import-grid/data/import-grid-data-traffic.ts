import {NgIf} from "@angular/common";
import {Component, Input} from "@angular/core";
import {ImportGridData} from "./import-grid-data";
import {ImportGridTrafficLight, TrafficLightStatus, TrafficLightType} from "../traffic/import-grid-traffic-light";

@Component({
    selector: 'jbr-import-grid-data-traffic',
    templateUrl: './import-grid-data-traffic.html',
    styleUrls: ['./import-grid-data-traffic.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataTraffic extends ImportGridData {
    @Input() type: TrafficLightType;

    getText(): string {
        return "";
    }

    displayStatus(): boolean {
        if(this.file) {
            return this.file.visible;
        }

        return false;
    }

    statusClass(): string {
        switch (ImportGridTrafficLight.getTrafficLightStatus(this.file.source,this.type)) {
            case TrafficLightStatus.Red:
                return "light red-light";
            case TrafficLightStatus.Amber:
                return "light amber-light";
            case TrafficLightStatus.Green:
                return "light green-light";
        }

        return "light unknown-light";
    }

    getTitle(): string {
        return ImportGridTrafficLight.getHeaderTitle(this.type);
    }
}
