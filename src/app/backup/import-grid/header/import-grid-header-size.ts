import {Component, Input} from '@angular/core';
import {ImportGridHeader} from './import-grid-header';

@Component({
    selector: 'jbr-import-grid-header-size',
    templateUrl: './import-grid-header-size.html',
    styleUrls: ['./import-grid-header-size.css'],
    imports: [],
    standalone: true
})
export class ImportGridHeaderSize extends ImportGridHeader {
    @Input() importValue = false;

    getText(): string {
        return this.importValue ? 'Import Size' : 'Size';
    }
}
