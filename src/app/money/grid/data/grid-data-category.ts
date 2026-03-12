import {Component, EventEmitter, OnInit, TemplateRef, Type} from '@angular/core';
import {TransactionReport} from '../../transaction/transactionReport';
import {MoneyService} from '../../money.service';
import {MoneyCategory} from '../../category/money-cat.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Category} from '../../category/category';
import {GridData} from './grid-data';
import {TransactionEditType} from '../../transaction/transactionEditType';
import {GridDataEvent} from './grid-data-event';
import {HeaderType} from '../header/grid-header-type';
import {PopupComponent} from '../../../standard/popup.component';
import {JbAccount} from '../../account/jbAccount';

@Component({
    selector: 'jbr-grid-data-category',
    templateUrl: './grid-data-category.html',
    styleUrls: ['./grid-data-category.css'],
    imports: [
        PopupComponent
    ],
    standalone: true
})
export class GridDataCategory extends GridData implements OnInit {
    modalRef: BsModalRef;

    content: Type<any>;
    inputs: Record<string, unknown>;

    selectCategoryEvent: EventEmitter<Category>;
    selectTransferEvent: EventEmitter<JbAccount>;

    constructor(private readonly modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        this.selectCategoryEvent = new EventEmitter();
        this.selectCategoryEvent.subscribe(category => {
            this.onSelect(category);
        });

        this.selectTransferEvent = new EventEmitter();
        this.selectTransferEvent.subscribe(account => {
            this.onSelectTransfer(account);
        });

        this.content = MoneyCategory;
        this.inputs = { filterMode: false,
            allowTransfer: this.transaction.new,
            selectCategoryEvent: this.selectCategoryEvent,
            selectTransferEvent: this.selectTransferEvent };
    }

    getCategoryName(): string {
        if (this.transaction == null) {
            return '';
        }

        if (this.transaction.type !== TransactionReport.TRANSACTION) {
            return '';
        }

        if (this.transaction.category?.name == null) {
            return '(none)';
        }

        return this.transaction.category.name;
    }

    getCategoryColour(): string {
        if (this.transaction == null || this.transaction.category?.colour == null) {
            return 'FFFFFF';
        }

        return this.transaction.category.colour;
    }

    getTextColour() {
        return MoneyService.getTextColor(this.getCategoryColour());
    }

    openModal(template: TemplateRef<any>) {
        // If the category is a system category, do not allow amendment.
        if (this.transaction?.category?.systemUse) {
            return;
        }

        // Stop the editing of other transactions.
        if (this.transaction != null && this.transaction.editing !== TransactionEditType.None) {
            this.transaction.editing = TransactionEditType.None;
        }
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onExit() {
        this.modalRef.hide();
    }

    onSelect(category: Category) {
        this.modalRef.hide();

        this.transaction.category = category;
        this.transaction.modified = true;

        const event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Category;
        this.valueChanged.emit(event);
    }

    onSelectTransfer(account: JbAccount) {
        this.modalRef.hide();

        // Account transfer
        this.transaction.category = new Category('TRF', 'Transfer (' + account.id + ')', 0, false, 'FFFFFF', account.id, false, false);
        this.transaction.modified = true;
        this.transaction.transferAccountId = account.id;

        const event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Category;
        this.valueChanged.emit(event);
    }
}
