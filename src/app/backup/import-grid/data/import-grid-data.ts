import {Component, Input} from "@angular/core";
import {IImportGridFile} from "../import-grid-file";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export class ImportGridData {
    @Input() file: IImportGridFile;
}
