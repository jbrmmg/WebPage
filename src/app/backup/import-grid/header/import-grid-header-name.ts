import {Component, Input} from '@angular/core';
import {ImportGridHeader} from './import-grid-header';

@Component({
    selector: 'jbr-import-grid-header-name',
    templateUrl: './import-grid-header-name.html',
    styleUrls: ['./import-grid-header-name.css'],
    imports: [],
    standalone: true
})
export class ImportGridHeaderName extends ImportGridHeader {
    @Input() importValue = false;

    getText(): string {
        return this.importValue ? 'Import Name' : 'Name';
    }
}
