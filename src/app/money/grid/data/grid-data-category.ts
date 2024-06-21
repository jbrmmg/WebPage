import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";

@Component({
    selector: 'jbr-grid-data-category',
    templateUrl: './grid-data-category.html',
    styleUrls: ['./grid-data-category.css'],
    standalone: true
})
export class GridDataCategory {
    @Input() transaction: ITransactionReport;
    protected readonly MoneyService = MoneyService;
}
