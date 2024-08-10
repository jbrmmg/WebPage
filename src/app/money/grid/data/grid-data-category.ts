import {Component, TemplateRef} from "@angular/core";
import {TransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";
import {MoneyCategory} from "../../category/money-cat.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Category} from "../../category/category";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-category',
    templateUrl: './grid-data-category.html',
    styleUrls: ['./grid-data-category.css'],
    imports: [
        MoneyCategory
    ],
    standalone: true
})
export class GridDataCategory extends GridData {
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
        super();
    }

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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onClear() {
        this.modalRef.hide();
    }

    onExit() {
        this.modalRef.hide();
    }

    onSelect(category: Category) {
        this.modalRef.hide();

        this.transaction.category = category;
    }

    onSelectTransfer(id: string) {
        this.modalRef.hide();

        // Account transfer
        this.transaction.category = new Category("TRF", "Transfer (" + id + ")", 0, false, "FFFFFF", id, false, false)
    }

    allowTransfer(): boolean {
        return this.transaction.new;
    }
}
