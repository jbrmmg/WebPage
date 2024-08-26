import {Component, EventEmitter, Output, TemplateRef} from "@angular/core";
import {NgIf} from "@angular/common";
import {GridData} from "./grid-data";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyFiles} from "../../files/money-files";
import {IFile} from "../../files/file";

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

    @Output() clearFileEmitter: EventEmitter<void> = new EventEmitter();
    @Output() selectFileEmitter: EventEmitter<IFile> = new EventEmitter();

    constructor(private modalService: BsModalService) {
        super();
    }

    selectFile(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onExit() {
        this.modalRef.hide();
    }

    onClearFile() {
        this.modalRef.hide();
        this.clearFileEmitter.emit();
    }

    onSelectFile(file: IFile) {
        this.modalRef.hide();
        this.selectFileEmitter.emit(file);
    }
}
