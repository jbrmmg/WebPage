import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";

@Component({
    selector: 'jbr-grid-data-account',
    templateUrl: './grid-data-account.html',
    styleUrls: ['./grid-data-account.css'],
    standalone: true
})
export class GridDataAccount {
    @Input() transaction: ITransactionReport;

    constructor() {
    }

    getAccountImage(id: string) : string {
        return MoneyService.getAccountImage(id);
    }
}
