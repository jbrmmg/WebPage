import {Component, Input, OnInit} from "@angular/core";
import {MoneyCatFilterEntry} from './money-cat-filter-entry'
import {Category, ICategory} from "../money-category";
import {Observable, Subscription} from "rxjs";

@Component({
    selector: 'money-category-filter',
    templateUrl: './money-cat-filter.component.html',
    styleUrls: ['./money-cat-filter.component.css']
})
export class MoneyCategoryFilterComponent implements OnInit {

    private categoryEntries: MoneyCatFilterEntry[];
    private categories: Category[];
    private eventsSubscription: Subscription;

    @Input() categoriesChange: Observable<Category[]>;

    ngOnInit(): void {
        this.eventsSubscription = this.categoriesChange.subscribe((categories) => this.doSomething(categories));

        console.log("Updated categories (init)")
        if(this.categories != null)
        {
            this.doSomething(this.categories);
        }
    }

    ngOnDestory() {
        this.eventsSubscription.unsubscribe();
    }

    doSomething(categories: Category[]) {
        this.categories = categories;
        this.categoryEntries = [];

        let selected = 0;
        for(let nextCategory of categories) {
            if(nextCategory.selected) {
                selected++;
            }
        }

        let split = 100 / selected;
        let nextPercentage = 100;
        let nextIndex = 0;

        for(let nextCategory of categories) {
            if (nextCategory.selected) {
                this.categoryEntries[nextIndex] = new MoneyCatFilterEntry(nextPercentage, "#" + nextCategory.colour);

                nextPercentage = nextPercentage - split;
                nextIndex++;
            }
        }

        console.log("Updated categories " + this.categoryEntries.length)
    }
}
