import {NgForOf, NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";
import {ImportGridTrafficLight, TrafficLightStatus, TrafficLightType} from "../traffic/import-grid-traffic-light";

@Component({
    selector: 'jbr-import-grid-data-traffic',
    templateUrl: './import-grid-data-traffic.html',
    styleUrls: ['./import-grid-data-traffic.css'],
    imports: [
        NgIf,
        NgForOf
    ],
    standalone: true
})
export class ImportGridDataTraffic extends ImportGridData {
    getText(): string {
        return "";
    }

    displayStatus(): boolean {
        if(this.file) {
            return this.file.visible;
        }

        return false;
    }

    statusClass(type: TrafficLightType): string {
        let leftClass: string = "";
        if(type == TrafficLightType.readPreImportFile) {
            leftClass = "left ";
        }

        switch (ImportGridTrafficLight.getTrafficLightStatus(this.file.source,type)) {
            case TrafficLightStatus.Red:
                return leftClass + "light red-light";
            case TrafficLightStatus.Amber:
                return leftClass + "light amber-light";
            case TrafficLightStatus.Green:
                return leftClass + "light green-light";
        }

        return leftClass + "light unknown-light";
    }

    getTitle(type: TrafficLightType): string {
        return ImportGridTrafficLight.getHeaderTitle(type);
    }

    getStatusTypes(): TrafficLightType[] {
        let result: TrafficLightType[] = [];

        Object.values(TrafficLightType).forEach(value => {
            if(!isNaN(Number(value))) {
                result.push(Number(value));
            }
        });

        return result;
    }

    protected readonly TrafficLightType = TrafficLightType;
}
