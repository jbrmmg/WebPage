import {Component, TemplateRef} from "@angular/core";
import {GridHeader} from "./grid-header";
import {NgForOf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
    selector: 'jbr-grid-header-date',
    templateUrl: './grid-header-date.html',
    styleUrls: ['./grid-header-date.css'],
    imports: [
        NgForOf
    ],
    standalone: true
})
export class GridHeaderDate extends GridHeader {
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
