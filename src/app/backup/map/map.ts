import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {LatLong} from './map-latlong';
import {NgStyle} from '@angular/common';

export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

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
    private marker: L.Marker = null;

    @ViewChild('mapEl') mapEl: ElementRef;

    @Input() height = 237;
    @Input() width = 316;
    @Input() fullWidth = false;
    @Input() topMargin = 2;
    @Input() bottomMargin = 2;
    @Input() leftMargin = 2;
    @Input() rightMargin = 2;
    @Input() latLong: LatLong;
    @Input() clickable = false;
    @Output() boundsChange = new EventEmitter<MapBounds>();
    @Output() locationClick = new EventEmitter<LatLong>();

    private emitBounds(): void {
        if (!this.map) return;
        const b = this.map.getBounds();
        this.boundsChange.emit({
            north: b.getNorth(),
            south: b.getSouth(),
            east: b.getEast(),
            west: b.getWest()
        });
    }

    private initMap(): void {
        this.map = L.map(this.mapEl.nativeElement, { center: [34.65054, 32.720322], zoom: 16 });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);

        this.map.on('moveend zoomend', () => this.emitBounds());

        if (this.latLong) {
            this.map.panTo({lat: this.latLong.lat, lng: this.latLong.long});
        } else {
            this.map.panTo({lat: 51.60146388888889, lng: -0.37789999999999996});
        }

        if (this.clickable) {
            if (this.latLong) {
                this.marker = L.marker([this.latLong.lat, this.latLong.long]).addTo(this.map);
            }

            this.map.on('click', (e: any) => {
                const loc = new LatLong();
                loc.lat = e.latlng.lat;
                loc.long = e.latlng.lng;

                if (this.marker) {
                    this.marker.setLatLng([loc.lat, loc.long]);
                } else {
                    this.marker = L.marker([loc.lat, loc.long]).addTo(this.map);
                }

                this.locationClick.emit(loc);
            });
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
        this.marker = null;
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
