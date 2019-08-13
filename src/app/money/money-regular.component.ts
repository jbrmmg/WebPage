import {Component, OnInit} from "@angular/core";
import {MoneyService} from "./money.service";
import {IRegular} from "./money-regular";

@Component({
    templateUrl: './money-regular.component.html',
    styleUrls: ['./money-regular.component.css']
})
export class MoneyRegularComponent implements OnInit {
    regularPayments: IRegular[];
    errorMessage: string;

    constructor(private _moneyService: MoneyService) {
    }

    ngOnInit(): void {
        this._moneyService.getRegularPayments().subscribe(
            payments => {
                this.regularPayments = payments;
            },
            error => this.errorMessage = <any>error,
            () => {
                console.info("Completed get regular payments.")
            });
    }
}
