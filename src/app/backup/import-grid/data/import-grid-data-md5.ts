import {Component, Input} from '@angular/core';
import {ImportGridData} from './import-grid-data';

@Component({
    selector: 'jbr-import-grid-data-md5',
    templateUrl: './import-grid-data-md5.html',
    styleUrls: ['./import-grid-data-md5.css'],
    imports: [],
    standalone: true
})
export class ImportGridDataMd5 extends ImportGridData {
    @Input() importValue = false;

    getText(): string {
        if (this.file?.source) {
            if (this.importValue) {
                if (this.file.source.importMd5) {
                    return this.file.source.importMd5;
                }
            } else if (this.file.source.md5) {
                return this.file.source.md5;
            }
        }

        return '';
    }
}
