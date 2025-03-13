import {Component, EventEmitter, Output} from "@angular/core";
import {ImportGridFileDisplay} from "../import-grid-file-display";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class ImportGridHeader {
    @Output() fireSource: EventEmitter<String> = new EventEmitter();

    abstract getText(): string;

    fireSort() {
        this.fireSource.emit(this.getText())
    }
}
