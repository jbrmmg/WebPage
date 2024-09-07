import {Component, OnInit, TemplateRef, Type} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgForOf, NgIf} from "@angular/common";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {MoneyCategory} from "../../category/money-cat.component";
import {HeaderType} from "./grid-header-type";
import {PopupComponent} from "../../../standard/popup.component";

@Component({
    selector: 'jbr-grid-header-category',
    templateUrl: './grid-header-category.html',
    styleUrls: ['./grid-header-category.css'],
    imports: [
        NgForOf,
        ButtonsModule,
        NgIf,
        MoneyCategory,
        PopupComponent
    ],
    standalone: true
})
export class GridHeaderCategory extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    allSelected: boolean;
    content: Type<any>;
    inputs: Record<string,unknown>;

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        if(this.filter.categories == null) {
            this.filter.categories = [];
        }

        // Set up the content
        this.content = MoneyCategory;
        this.inputs = { filterMode: true,
            allowTransfer: false,
            filter: this.filter,
            allSelected: this.allSelected };
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onClear() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.categories = [];

            let event: FilterEvent = new FilterEvent();
            event.source = HeaderType.Category;
            this.filterChanged.emit(event);
        }
    }

    onExit() {
        this.modalRef.hide();
    }

    onOK() {
        this.modalRef.hide();

        // If all are selected then clear the filter as it's the same as no filter.
        if(this.allSelected) {
            this.filter.categories = [];
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Category;
        this.filterChanged.emit(event);
    }
}
