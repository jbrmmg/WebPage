import {Component, OnInit} from "@angular/core";
import {MatSelectModule} from "@angular/material/select";
import {MoneyService} from "../../money.service";
import {JbAccount} from "../../account/jbaccount";
import {NgForOf, NgIf} from "@angular/common";

class JbAccountOption {
    id: string;
    display: string;
    all: boolean;
}

@Component({
    selector: 'jbr-filter-account',
    templateUrl: './filter-account.html',
    styleUrls: ['./filter-account.css'],
    imports: [
        MatSelectModule,
        NgForOf,
        NgIf
    ],
    standalone: true
})
export class FilterAccount implements OnInit {
    accounts: JbAccountOption[] = [];
    errorMessage: string;

    constructor(private _moneyService: MoneyService) {
        let all: JbAccountOption = new JbAccountOption();
        all.id = "";
        all.display = "All"
        all.all = true;

        this.accounts.push(all)
    }

    ngOnInit(): void {
        this._moneyService.getAccounts().subscribe({
            next: (accounts) => {
                accounts.forEach(value => {
                    let next: JbAccountOption = new JbAccountOption();
                    next.all = false;
                    next.display = value.name;
                    if(value.closed) {
                        next.display += " (c)";
                    }
                    next.id = value.id;

                    this.accounts.push(next);
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Account Options Loaded")
            }
        });
    }

    getAccountImage(id: string) : string {
        return MoneyService.getAccountImage(id);
    }
}
