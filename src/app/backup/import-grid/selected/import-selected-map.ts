import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import {LatLong} from "../import-grid-latlong";

@Component({
    selector: 'import-selected-map',
    templateUrl: './import-selected-map.html',
    standalone: true,
    styleUrls: ['./import-selected-map.css']
})
export class ImportSelectedMap implements AfterViewInit {
    private map;

    private initMap(): void {
        this.map = L.map('map', { center: [34.65054, 32.720322], zoom: 16 });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);

        this.map.panTo({lat: 51.60146388888889, lng: -0.37789999999999996});
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    move(location: LatLong) {
        if(this.map) {
            console.log("move " + location.lat + " " + location.long);
            this.map.panTo({lat: location.lat, lng: location.long});
            this.map.zoom = 16;
        }
    }
}
