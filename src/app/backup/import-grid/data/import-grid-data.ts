import {Component, Input} from "@angular/core";
import {ImportGridFile} from "../import-grid-file";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class ImportGridData {
    @Input() file: ImportGridFile;

    abstract getText(): string;
}
