import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
    selector: 'jbr-star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})

export class StarComponent implements OnChanges {
    starWidth: number;
    @Input() rating: number;
    @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

    ngOnChanges(): void {
        this.starWidth = this.rating * 75 / 5;
    }

    onClick() {
        this.ratingClicked.emit('the rating ' + this.rating + ' was clicked!');
    }
}
