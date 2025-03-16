import {Component, ViewChild} from '@angular/core';
import {ImportSelectedMap} from "./import-selected-map";
import {ImportGridFileDisplay} from "../import-grid-file-display";
import {LatLong} from "../import-grid-latlong";
import {ImportSelectedImage} from "./import-selected-image";
import {ImportSelectedData} from "./import-selected-data";

@Component({
    selector: 'import-selected',
    templateUrl: './import-selected.html',
    standalone: true,
    imports: [
        ImportSelectedMap,
        ImportSelectedImage,
        ImportSelectedData
    ],
    styleUrls: ['./import-selected.css']
})
export class ImportSelected {
    @ViewChild('map') map: ImportSelectedMap;
    @ViewChild('image') image: ImportSelectedImage;
    @ViewChild('data') data: ImportSelectedData;

    selectionChangeMap(file: ImportGridFileDisplay) {
        if(file && file.source && file.source.location) {
            this.map.move(file.source.location);
            return;
        }

        // Move to a default
        let defaultLocation: LatLong = new LatLong();
        defaultLocation.lat = 51.60146388888889;
        defaultLocation.long = -0.37789999999999996;

        this.map.move(defaultLocation);
    }

    selectionChangeImage(file: ImportGridFileDisplay) {
        if(file && file.source && file.source.location) {
            this.image.display(file);
            return;
        }

        // Move to a default
        this.image.clear();
    }

    selectionChangeData(file: ImportGridFileDisplay) {
        if(file && file.source && file.source) {
            this.data.display(file);
            return;
        }

        // Move to a default
        this.data.clear();
    }

    selectionChange(file: ImportGridFileDisplay) {
        this.selectionChangeMap(file);
        this.selectionChangeImage(file);
        this.selectionChangeData(file);
    }
}
