import {Component} from "@angular/core";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class SummaryGridHeader {
    abstract getText(): string;
}
