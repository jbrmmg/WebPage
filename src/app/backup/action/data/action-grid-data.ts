import {Component, Input} from '@angular/core';
import {Action} from '../backup-action';

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class ActionGridData {
    @Input() action: Action;

    abstract getText(): string;
}
