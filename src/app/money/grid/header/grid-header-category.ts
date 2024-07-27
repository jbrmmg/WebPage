import {Component, TemplateRef} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgForOf, NgIf} from "@angular/common";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {MoneyCategory} from "../../category/money-cat.component";
import {Category} from "../../category/category";
import {HeaderType} from "./grid-header-type";

@Component({
    selector: 'jbr-grid-header-category',
    templateUrl: './grid-header-category.html',
    styleUrls: ['./grid-header-category.css'],
    imports: [
        NgForOf,
        ButtonsModule,
        NgIf,
        MoneyCategory
    ],
    standalone: true
})
export class GridHeaderCategory extends GridHeader {
    modalRef: BsModalRef;
    errorMessage: string;
    categoryIds: string[];

    constructor(private modalService: BsModalService) {
        super();
    }

    openModal(template: TemplateRef<any>) {
        // Update the selections from the list of selected ids.
        this.categoryIds = [];
        if(this.filter != null && this.filter.categories != null) {
            this.filter.categories.forEach(category => {
                this.categoryIds.push(category.id);
            })
        }

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

    onSelect(ids: string[]) {
        this.modalRef.hide();

        if (this.filter != null) {
            console.log("notn noull")
            this.filter.categories = [];
            ids.forEach(id => {
                this.filter.categories.push(new Category(id,"",0,false,null,null, false, false))
            });

            let event: FilterEvent = new FilterEvent();
            event.source = HeaderType.Category;
            this.filterChanged.emit(event);
        }
    }
}
