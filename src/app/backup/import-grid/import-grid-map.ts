import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'import-grid-map',
    templateUrl: './import-grid-map.html',
    standalone: true,
    styleUrls: ['./import-grid-map.css']
})
export class ImportGridMap implements AfterViewInit {
    constructor() { }

    private map;

    private initMap(): void {
        this.map = L.map('map', { center: [34.65054, 32.720322], zoom: 16 });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
    }

    ngAfterViewInit(): void {
        this.initMap();
    }
}
