import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class ImportGridHeader {
    @Output() fireSource: EventEmitter<string> = new EventEmitter();

    abstract getText(): string;

    fireSort() {
        this.fireSource.emit(this.getText());
    }
}
