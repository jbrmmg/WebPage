import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";

@Component({
    selector: 'jbr-grid-data-description',
    templateUrl: './grid-data-description.html',
    styleUrls: ['./grid-data-description.css'],
    standalone: true
})
export class GridDataDescription {
    @Input() transaction: ITransactionReport;
    protected readonly MoneyService = MoneyService;
}
