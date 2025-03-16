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
        this.imagePath = "backup/fileImage?id=1028811";
    }

    getImagePath(): string {
        return this.imagePath;
    }

    display(file: ImportGridFileDisplay) {
        console.log("image update");
        // TODO - update the image path
    }

    clear() {
        // TODO - update the image path
    }
}
