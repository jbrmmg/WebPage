import {Component, OnInit} from "@angular/core";
import {MoneyService} from "./money.service";
import {JbAccount} from "./money-account";
import {Category, ICategory} from "./money-category";
import {IMatch, Match} from "./money-match";
import {IFile} from "./money-file";

@Component({
    templateUrl: './money-rec.component.html',
    styleUrls: ['./money-rec.component.css']
})
export class MoneyRecComponent implements OnInit {
    accounts: JbAccount[];
    categories: Category[];
    matches: Match[];
    files: IFile[];
    errorMessage: string;
    textData: string;
    radioAccount: string;

    constructor(private _moneyService: MoneyService) {
    }

    get uncatorisedMatches() : Match[] {
        return this.matches.filter((match: IMatch) =>
            match.category == "")
    }

    get catorisedMatches() : Match[] {
        return this.matches.filter((match: IMatch) =>
            match.category != "")
    }

    ngOnInit(): void {
        this.matches = [];
        this._moneyService.getAccounts().subscribe(
            accounts => {
                this.accounts = accounts;
            },
            error => this.errorMessage = <any>error,
            () => {
                this.accounts.forEach(value => {
                    value.selected = false;
                })
            }
        );
        this._moneyService.getCatories().subscribe(
            categories => {
                this.categories = categories;
            },
            error => this.errorMessage = <any>error,
            () => {
                this.categories.forEach(value => {
                    value.selected = false;
                })
            }
        );
        this._moneyService.getFiles().subscribe(
            files => {
                this.files = files;
            },
            error => this.errorMessage = <any>error
        );
    }

    getImage(account: JbAccount): string {
        if(account.id == this.radioAccount) {
            return MoneyService.getAccountImage(account.id);
        }

        return MoneyService.getDisabledAccountImage(account.id);
    }

    getAccountColour(index: number) : string {
        if(index < this.accounts.length)
        {
            return "#" + this.accounts[index].colour;
        }

        return "#FFFFFF";
    }

    getCategoryColour(catId: string) : string {
        let result = "#FFFFFF";

        this.categories.forEach(value =>
        {
           if(value.id == catId) {
               result = "#" + value.colour;
           }
        });

        return result;
    }

    getCategoryTextColour(catId: string) : string {
        return this.getCategoryBrightness(catId) > 130 ? "#000000" : "#FFFFFF";
    }

    getCategoryBrightness(catId: string) : number {
        let result = 0;

        this.categories.forEach(value =>
        {
            if(value.id == catId) {
                result = MoneyService.getBrightness(value.colour);
            }
        });

        return result;
    }

    getAmtTextColour(amt: number) : string {
        if(amt < 0) {
            return "#FF0000"
        } else {
            return "#000000"
        }
    }

    get filteredCatgories() : Category[] {
        return this.categories.filter((category: ICategory) =>
            category.systemUse == "N")
    }

    onAccountClick(account: JbAccount) {
        this.matches = [];
        this._moneyService.getMatches(account).subscribe(
            matches => {
                matches.forEach(value => {
                    this.matches.push(new Match(value));
                })
            },
            error => this.errorMessage = <any>error,
            () => {
                console.log("Request matches Complete." + account.id);
            }
        );
    }

    onCategoryClick(category: ICategory) {
        this.matches.forEach( value => {
            if (value.selected) {
                    console.log("Check Cat " + value.description);
                    value.category = category.id;
                    value.selected = false;
                    this._moneyService.setCategory(value,category);
                }
            });
    }

    onRowClick(matchRow: Match) {
        console.log("Click - " + matchRow.selected);
        matchRow.selected = !matchRow.selected;
    }

    actOnMatch(matchRow: Match) {
        console.log("Match Click - " + matchRow);
    }

    onSubmitData() {
        console.log("Submit Data - " + this.textData);
        this._moneyService.submitRecData(this.textData);
    }

    onClearData() {
        console.log("Clear Data");
        this._moneyService.clearRecData();
    }

    onAcceptTransactions(){
        console.log("Accept transaction");
        this._moneyService.autoAccept();
    }

    onLoadFile(filename: string, source: string) {
        console.log("Click - " + filename + " " + source);
        this._moneyService.loadFileRequest(filename,source);
    }
}
