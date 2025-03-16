import {Component} from '@angular/core';
import {ImportGridFileDisplay} from "../import-grid-file-display";

@Component({
    selector: 'import-selected-image',
    templateUrl: './import-selected-image.html',
    standalone: true,
    styleUrls: ['./import-selected-image.css']
})
export class ImportSelectedImage {
    imagePath: string;

    constructor() {
        this.imagePath = "api/backup/NoEntry.jpg";
    }

    getImagePath(): string {
        return this.imagePath;
    }

    display(file: ImportGridFileDisplay) {
        console.log("image update");

        if(file.source && file.source.imageSize) {
            this.imagePath = "backup/import-image?name=" + file.source.filename;
            return;
        }

        this.clear()
    }

    clear() {
        this.imagePath = "api/backup/NoEntry.jpg";
    }
}
