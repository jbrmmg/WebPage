import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {MoneyService} from "../money.service";
import {IAccount, JbAccount} from "../account/jbAccount";
import {IStatement} from "./statement";
import {ITransactionReport, TransactionReport} from "../transaction/transactionReport";
import {TransactionFilter} from "../transaction/transactionFilter";
import {StatementDate} from "./statementDate";
import {FinancialAmount} from "../transaction/financialAmount";

@Component({
    selector: 'jbr-statement',
    templateUrl: './money-statement.component.html',
    styleUrls: ['./money-statement.component.css'],
    imports: [
        NgForOf,
        ButtonsModule,
        NgIf,
        CurrencyPipe,
        NgClass
    ],
    standalone: true
})
export class MoneyStatement implements OnInit {
    @Input() account: IAccount;
    @Input() statement: IStatement;
    data: ITransactionReport[];
    transactions : ITransactionReport[];
    balances: ITransactionReport[];
    @Output() lockEmitter: EventEmitter<void> = new EventEmitter();
    @Output() exitEmitter: EventEmitter<void> = new EventEmitter();

    constructor(private _moneyService: MoneyService) {
    }

    ngOnInit(): void {
        console.log(this.account);
        console.log(this.statement);

        let filter: TransactionFilter = new TransactionFilter();
        let account: JbAccount = new JbAccount( this.account.id,
            this.account.name,
            this.account.imagePrefix,
            this.account.colour,
            this.account.closed);
        let date: StatementDate = new StatementDate(this.statement.year,this.statement.month);

        filter.accounts = [];
        filter.accounts.push(account);
        filter.statementDate = date;

        this._moneyService.getTransactions(filter).subscribe({
            next: (val) => {
                this.data = val;
            },
            error: (response) => {
                console.error("getTransactions Failed " + response);
            },
            complete: () => {
                // Split data into transactions and balances.
                this.transactions = [];
                this.balances = [];

                this.data.forEach(next => {
                   if(next.type == TransactionReport.TRANSACTION) {
                       this.transactions.push(next);
                   } else {
                       this.balances.push(next);
                   }
                });
                console.log("getTransactions Complete. ")
            }
        });
    }

    isBlank(transaction: ITransactionReport, credit: boolean): boolean {
        if(transaction.amount != null && transaction.amount.type == FinancialAmount.CREDIT && credit)
            return false;

        return !(transaction.amount != null && transaction.amount.type == FinancialAmount.DEBIT && !credit);
    }

    getCredit(transaction: ITransactionReport): number {
        if(transaction.amount != null && transaction.amount.type == FinancialAmount.CREDIT)
            return transaction.amount.value;

        return 0;
    }

    getDebit(transaction: ITransactionReport): number {
        if(transaction.amount != null && transaction.amount.type == FinancialAmount.DEBIT)
            return transaction.amount.value;

        return 0;
    }

    getBalance(transaction: ITransactionReport): number {
        return transaction.balance.value;
    }

    getDescription(transaction: ITransactionReport): string {
        return MoneyService.getTransactionDescription(transaction);
    }

    getBalanceClass(transaction: ITransactionReport): string {
        if(transaction.balance.type == FinancialAmount.DEBIT) {
            return "debit";
        }

        return "";
    }

    openBalanceClass(): string {
        if(this.getOpenBalance() < 0) {
            return "amount debit";
        }

        return "amount";
    }

    closeBalanceClass(): string {
        if(this.getCloseBalance() < 0) {
            return "amount debit";
        }

        return "amount";
    }

    getOpenBalance(): number {
        // Find the open balance.
        let result: number = 0;
        if(this.balances != null) {
            this.balances.forEach(next => {
                if (next.type == TransactionReport.OPEN_BALANCE) {
                    result = next.balance.value;
                }
            });
        }

        return result;
    }

    getCredits(): number {
        // Sum the credit values.
        let result: number = 0;
        if(this.transactions != null) {
            this.transactions.forEach(next => {
                if (next.amount != null && next.amount.type == FinancialAmount.CREDIT) {
                    result = result + next.amount.value;
                }
            });
        }

        return result;
    }

    getDebits(): number {
        // Sum the debits values.
        let result: number = 0;
        if (this.transactions != null) {
            this.transactions.forEach(next => {
                if (next.amount != null && next.amount.type == FinancialAmount.DEBIT) {
                    result = result + next.amount.value;
                }
            });
        }

        return result * -1;
    }

    getCloseBalance(): number {
        // Find the closing balance (use future balance if available, else today balance.).
        let result: number = 0;
        let resultSet: boolean = false;

        if(this.balances != null) {
            this.balances.forEach(next => {
                if (next.type == TransactionReport.FUTURE_BALANCE) {
                    result = next.balance.value;
                } else if (next.type == TransactionReport.TODAY_BALANCE && !resultSet) {
                    result = next.balance.value;
                }
            });
        }

        return result;
    }

    lock() {
        if(!this.statement.locked){
            this.lockEmitter.emit();
        }
    }

    isLocked() {
        return this.statement.locked;
    }

    onExit() {
        this.exitEmitter.emit();
    }
}
