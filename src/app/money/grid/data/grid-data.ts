import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export class GridData {
    @Input() transaction: ITransactionReport;

}
