import {Component, EventEmitter, OnInit, Output, TemplateRef, Type} from '@angular/core';
import {NgIf} from '@angular/common';
import {GridData} from './grid-data';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {MoneyFiles} from '../../files/money-files';
import {IFile} from '../../files/file';
import {PopupComponent} from '../../../standard/popup.component';

@Component({
    selector: 'jbr-grid-data-from-reconciliation',
    templateUrl: './grid-data-from-reconciliation.html',
    styleUrls: ['./grid-data-from-reconciliation.css'],
    imports: [
        NgIf,
        PopupComponent
    ],
    standalone: true
})
export class GridDataFromReconciliation extends GridData implements OnInit {
    modalRef: BsModalRef;

    content: Type<any>;
    inputs: Record<string, unknown>;

    @Output() clearFileEmitter: EventEmitter<void> = new EventEmitter();
    @Output() selectFileEmitter: EventEmitter<IFile> = new EventEmitter();

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        const selectFileEvent: EventEmitter<IFile> = new EventEmitter();
        selectFileEvent.subscribe(file => {
            this.onSelectFile(file);
        });

        this.content = MoneyFiles;
        this.inputs = { selectFileEmitter: selectFileEvent };
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
