import {Component, TemplateRef} from "@angular/core";
import {NgIf} from "@angular/common";
import {GridData} from "./grid-data";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyFiles} from "../../files/money-files";

@Component({
    selector: 'jbr-grid-data-from-reconciliation',
    templateUrl: './grid-data-from-reconciliation.html',
    styleUrls: ['./grid-data-from-reconciliation.css'],
    imports: [
        NgIf,
        MoneyFiles
    ],
    standalone: true
})
export class GridDataFromReconciliation extends GridData {
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
        super();
    }

    selectFile(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
}
