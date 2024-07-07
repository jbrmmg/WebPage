import {Component, OnInit, TemplateRef} from "@angular/core";
import {GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyService} from "../../money.service";

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
    standalone: true
})
export class GridHeaderCategory extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    categories: CategoryFilterOption[] = [];
    errorMessage: string;

    constructor(private modalService: BsModalService,
                private _moneyService: MoneyService ) {
        super();
    }

    ngOnInit(): void {
        this._moneyService.getCategories().subscribe({
            next: (accounts) => {
                accounts.forEach(value => {
                    let next: CategoryFilterOption = new CategoryFilterOption();
                    next.selected = this.isCategorySelected(value.id);
                    next.display = value.name;
                    next.id = value.id;
                    next.colour = value.colour;
                    next.textColour = MoneyService.getTextColor(value.colour);

                    this.categories.push(next);
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Account Options Loaded")
            }
        });
    }

    isCategorySelected(id: string) : boolean {
        if(this.filter == null || this.filter.categories == null || this.filter.categories.length < 1) {
            return false;
        }

        let result: boolean = false;
        this.filter.categories.forEach(value => {
            if(value.id == id) {
                result = true;
                return;
            }
        });

        return result;
    }

    openModal(template: TemplateRef<any>) {
        // Update the selections from the list of selected ids.
        this.categories.forEach(value => {
            value.selected = this.isCategorySelected(value.id);
        })

        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }
}
