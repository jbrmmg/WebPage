import {Component} from '@angular/core';
import {ImportGridFileDisplay} from '../import-grid-file-display';
import {NgIf} from '@angular/common';

@Component({
    selector: 'import-selected-image',
    templateUrl: './import-selected-image.html',
    standalone: true,
    imports: [
        NgIf
    ],
    styleUrls: ['./import-selected-image.css']
})
export class ImportSelectedImage {
    imagePath = 'api/backup/NoEntry.jpg';
    text: string;
    videoPath: string;
    image = true;
    video = false;

    constructor() {
    }

    getImagePath(): string {
        return this.imagePath;
    }

    getVideoPath(): string {
        return this.videoPath;
    }

    display(file: ImportGridFileDisplay) {
        console.log('image update');

        if (file.source?.imageSize && file.source.image) {
            this.imagePath = 'backup/import/file/image?name=' + file.source.filename;
            this.text = file.source.filename;
            this.image = true;
            this.video = false;
            return;
        } else if (file.source?.video) {
            this.videoPath = 'backup/import/file/video?name=' + file.source.filename;
            this.text = file.source.filename;
            this.video = true;
            return;
        }

        this.video = false;
        this.clear();
    }

    getText() {
        return this.text;
    }

    clear() {
        this.imagePath = 'api/backup/NoEntry.jpg';
    }

    showImage(): boolean {
        return this.image && !this.video;
    }

    showVideo(): boolean {
        return this.video;
    }
}
