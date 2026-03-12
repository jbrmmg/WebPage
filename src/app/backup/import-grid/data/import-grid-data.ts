import {Component, Input} from '@angular/core';
import {ImportGridFileDisplay} from '../import-grid-file-display';

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class ImportGridData {
    @Input() file: ImportGridFileDisplay;

    abstract getText(): string;
}
