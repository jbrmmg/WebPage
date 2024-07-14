import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-grid-data-account',
    templateUrl: './grid-data-account.html',
    styleUrls: ['./grid-data-account.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataAccount {
    @Input() transaction: ITransactionReport;

    constructor() {
    }

    hasAccount() : boolean {
        return this.transaction != null && this.transaction.account != null;
    }

    getAccountImage() : string {
        return MoneyService.getAccountImage(this.transaction.account.id);
    }
}
