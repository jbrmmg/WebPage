import {Component, TemplateRef} from "@angular/core";
import {GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
    selector: 'jbr-grid-header-amount',
    templateUrl: './grid-header-amount.html',
    styleUrls: ['./grid-header-amount.css'],
    standalone: true
})
export class GridHeaderAmount extends GridHeader {
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService ) {
        super();
    }

    exit() {
        this.modalRef.hide();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
}
