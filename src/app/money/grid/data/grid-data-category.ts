import {Component, Input} from "@angular/core";
import {ITransactionReport, TransactionReport} from "../../transaction/TransactionReport";
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

    getCategoryName(): string {
        if(this.transaction == null) {
            return "";
        }

        if(this.transaction.type != TransactionReport.TRANSACTION) {
            return "";
        }

        if(this.transaction.category == null || this.transaction.category.name == null) {
            return "(none)";
        }

        return this.transaction.category.name;
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
