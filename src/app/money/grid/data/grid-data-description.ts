import {Component, Input} from "@angular/core";
import {ITransactionReport, TransactionReport} from "../../transaction/TransactionReport";
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

    getDescription(): string {
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            return this.transaction.description;
        }

        if(this.transaction.type == TransactionReport.OPEN_BALANCE) {
            return "Opening Balance"
        }

        if(this.transaction.type == TransactionReport.TODAY_BALANCE) {
            return "Balance Today"
        }

        if(this.transaction.type == TransactionReport.FUTURE_BALANCE) {
            return "Future Balance"
        }

        return "";
    }

    getCategoryColour(): string {
        if(this.transaction == null || this.transaction.category == null || this.transaction.category.colour == null) {
            return "FFFFFF";
        }

        return this.transaction.category.colour;
    }

    getTextColour() {
        return MoneyService.getTextColor(this.getCategoryColour());
    }
}
