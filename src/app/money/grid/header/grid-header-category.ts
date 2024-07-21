import {Component, OnInit, TemplateRef} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyService} from "../../money.service";
import {NgForOf, NgIf} from "@angular/common";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {Category} from "../../category/category";
import {HeaderType} from "./grid-header-type";

class CategoryFilterOption {
    id: string;
    display: string;
    colour: string;
    textColour: string;
    selected: boolean;
}

@Component({
    selector: 'jbr-grid-header-category',
    templateUrl: './grid-header-category.html',
    styleUrls: ['./grid-header-category.css'],
    imports: [
        NgForOf,
        ButtonsModule,
        NgIf
    ],
    standalone: true
})
export class GridHeaderCategory extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    columns: number = 4;
    categories: CategoryFilterOption[][] = [];
    errorMessage: string;

    constructor(private modalService: BsModalService,
                private _moneyService: MoneyService ) {
        super();
    }

    ngOnInit(): void {
        this._moneyService.getCategories().subscribe({
            next: (categories) => {
                let row: CategoryFilterOption[] = [];
                this.categories.push(row);

                categories.forEach(value => {
                    let next: CategoryFilterOption = new CategoryFilterOption();
                    next.selected = this.isCategorySelected(value.id);
                    next.display = value.name;
                    next.id = value.id;
                    next.colour = value.colour;
                    next.textColour = MoneyService.getTextColor(value.colour);

                    if(row.length == this.columns) {
                        row = [];
                        this.categories.push(row);
                    }

                    row.push(next);
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Category Options Loaded")
            }
        });
    }

    categoryDisplay(item: CategoryFilterOption): string {
        return item.display + " (" + item.id + ")";
    }

    clickCategory(item: CategoryFilterOption) {
        item.selected = !item.selected;
    }

    isCategorySelected(id: string): boolean {
        // If there is no filter, then return false.
        if(this.filter == null || this.filter.categories == null || this.filter.categories.length == 0) {
            return false;
        }

        let result: boolean = false;
        this.filter.categories.forEach(value => {
                if(value.id == id) {
                    result = true;
                    return;
                }
            }
        )

        return result;
    }

    selectAll() {
        this.categories.forEach(row => {
            row.forEach(col => {
                col.selected = true;
            })
        });
    }

    clear() {
        this.filter.categories = [];
        this.modalRef.hide();

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Category;
        this.filterChanged.emit(event);
    }

    exit() {
        this.modalRef.hide();
    }

    selectAccounts() {
        this.modalRef.hide();

        this.filter.categories = [];

        // Are all the values the same?
        let anySelected: boolean = false;
        let allSelected: boolean = true;

        this.categories.forEach(row => {
            row.forEach(col => {
                if(col.selected) {
                    anySelected = true;
                } else {
                    allSelected = false;
                }
            })
        })

        if(anySelected || !allSelected) {
            // Generate a list of categories.
            this.categories.forEach(row => {
                row.forEach(col => {
                    if(col.selected) {
                        this.filter.categories.push(new Category(col.id,
                            col.display,
                            1,
                            false,
                            col.colour,
                            "",
                            false,
                            false));
                    }
                })
            })

            let event: FilterEvent = new FilterEvent();
            event.source = HeaderType.Category;
            this.filterChanged.emit(event);
        }
    }

    openModal(template: TemplateRef<any>) {
        // Update the selections from the list of selected ids.
        this.categories.forEach(row => {
            row.forEach(col => {
                col.selected = this.isCategorySelected(col.id);
            })
        })

        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    backgroundColour(item: CategoryFilterOption) {
        if(item.selected) {
            return '#' + item.colour;
        }

        return '#FFFFFF';
    }

    textColour(item: CategoryFilterOption) {
        if(item.selected) {
            return '#' + item.textColour;
        }

        return '#000000';
    }

    borderColor(item: CategoryFilterOption) {
        if(item.selected) {
            return '#000000';
        }

        return '#' + item.colour;
    }
}
