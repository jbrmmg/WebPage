import {NgIf} from "@angular/common";
import {Component, Input} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";
import {ImportGridTrafficLight, TrafficLightType} from "../traffic/import-grid-traffic-light";

@Component({
    selector: 'jbr-import-grid-header-traffic',
    templateUrl: './import-grid-header-traffic.html',
    styleUrls: ['./import-grid-header-traffic.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridHeaderTraffic extends ImportGridHeader {
    @Input() type: TrafficLightType;

    getText(): string {
        return ImportGridTrafficLight.getShortHeaderTitle(this.type);
    }

    getTitle(): string {
        return ImportGridTrafficLight.getHeaderTitle(this.type);
    }
}
