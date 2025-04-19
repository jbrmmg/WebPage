import {AfterViewInit, Component, Input} from '@angular/core';
import * as L from 'leaflet';
import {LatLong} from "./map-latlong";
import {NgStyle} from "@angular/common";

@Component({
    selector: 'jbr-map',
    templateUrl: './map.html',
    standalone: true,
    imports: [
        NgStyle
    ],
    styleUrls: ['./map.css']
})
export class Map implements AfterViewInit {
    private map;

    @Input() height: number = 237;
    @Input() width: number = 316;
    @Input() fullWidth: boolean = false;
    @Input() topMargin: number = 2;
    @Input() bottomMargin: number = 2;
    @Input() leftMargin: number = 2;
    @Input() rightMargin: number = 2;

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

    getMapHeight() : string {
        return this.height + "px";
    }

    getMapWidth() : string {
        if(this.fullWidth) {
            return "100%";
        }

        return this.width + "px";
    }

    getMapMargin() : string {
        return this.topMargin + "px" + " " + this.bottomMargin + "px" + " " + this.rightMargin + "px" + " " + this.leftMargin + "px";
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    move(location: LatLong) {
        if(this.map) {
            this.map.invalidateSize();
            this.map._resetView(this.map.getCenter(), this.map.getZoom(), true);

            console.log("move " + location.lat + " " + location.long);
            this.map.panTo({lat: location.lat, lng: location.long});
            this.map.zoom = 16;
        }
    }
}
