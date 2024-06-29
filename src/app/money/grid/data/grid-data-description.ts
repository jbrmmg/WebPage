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
