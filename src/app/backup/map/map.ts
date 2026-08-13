import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {LatLong} from './map-latlong';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'jbr-map',
    templateUrl: './map.html',
    standalone: true,
    imports: [
        NgStyle
    ],
    styleUrls: ['./map.css']
})
export class Map implements AfterViewInit, OnDestroy {
    private map;
    private visibilityObserver: IntersectionObserver;

    @ViewChild('mapEl') mapEl: ElementRef;

    @Input() height = 237;
    @Input() width = 316;
    @Input() fullWidth = false;
    @Input() topMargin = 2;
    @Input() bottomMargin = 2;
    @Input() leftMargin = 2;
    @Input() rightMargin = 2;
    @Input() latLong: LatLong;

    private initMap(): void {
        this.map = L.map(this.mapEl.nativeElement, { center: [34.65054, 32.720322], zoom: 16 });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);

        if (this.latLong) {
            this.map.panTo({lat: this.latLong.lat, lng: this.latLong.long});
        } else {
            this.map.panTo({lat: 51.60146388888889, lng: -0.37789999999999996});
        }
    }

    getMapHeight(): string {
        return this.height + 'px';
    }

    getMapWidth(): string {
        if (this.fullWidth) {
            return '100%';
        }

        return this.width + 'px';
    }

    getMapMargin(): string {
        return this.topMargin + 'px' + ' ' + this.bottomMargin + 'px' + ' ' + this.rightMargin + 'px' + ' ' + this.leftMargin + 'px';
    }

    ngAfterViewInit(): void {
        this.visibilityObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.visibilityObserver.disconnect();
                this.initMap();
            }
        });
        this.visibilityObserver.observe(this.mapEl.nativeElement);
    }

    ngOnDestroy(): void {
        this.visibilityObserver?.disconnect();
        if (this.map) {
            this.map.remove();
        }
    }

    move(location: LatLong) {
        if (this.map) {
            this.map.invalidateSize();
            this.map._resetView(this.map.getCenter(), this.map.getZoom(), true);

            console.log('📍 Move:', location.lat, location.long);
            this.map.panTo({lat: location.lat, lng: location.long});
            this.map.zoom = 16;
        }
    }
}
