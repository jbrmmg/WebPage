import {Component, Input} from '@angular/core';
import {ImportGridData} from './import-grid-data';

@Component({
    selector: 'jbr-import-grid-data-size',
    templateUrl: './import-grid-data-size.html',
    styleUrls: ['./import-grid-data-size.css'],
    imports: [],
    standalone: true
})
export class ImportGridDataSize extends ImportGridData {
    @Input() importValue = false;

    getText(): string {
        if (this.file?.source?.size) {
            if (this.importValue) {
                if (this.file.source.importSize) {
                    return this.file.source.importSize.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
            } else {
                return this.file.source.size.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }

        return '';
    }
}
