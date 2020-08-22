import {ListRowLineType} from './list-row-line-interface';
import {IAccount} from '../money-account';
import {ICategory} from '../money-category';

export class ListRowLine {
    private _rowType: ListRowLineType;
    private _isTotalRow: boolean;
    private _hasDate: boolean;
    private _dateDay: string;
    private _dateMonth: string;
    private _dateYear: string;
    private _hasAccount: boolean;
    private _account: IAccount;
    private _hasCategory: boolean;
    private _category: ICategory;
    private _description: string;
    private _amount: number;
    private _amountDisplay: string;
    private _hasButtonOne: boolean;
    private _enableButtonOne: boolean;
    private _classButtonOne: string;
    private _hasButtonTwo: boolean;
    private _enableButtonTwo: boolean;
    private _classButtonTwo: string;
    private _hasButtonThree: boolean;
    private _enableButtonThree: boolean;
    private _classButtonThree: string;
    private _selected: boolean;

    public ListRowLine() {
        this.isTotalRow = false;
        this.hasDate = false;
        this.dateDay = '';
        this.dateMonth = '';
        this.dateYear = '';
        this.hasAccount = false;
        this.account = null;
        this.hasCategory = false;
        this.category = null;
        this.description = '';
        this.amount = 0.0;
        this.amountDisplay = '?';
        this.hasButtonOne = false;
        this.enableButtonOne = false;
        this.classButtonOne = 'fa fa-check';
        this.hasButtonTwo = false;
        this.enableButtonTwo = false;
        this.classButtonTwo = 'fa fa-pencil';
        this.hasButtonThree = false;
        this.enableButtonThree = false;
        this.classButtonThree = 'fa fa-trash';
        this.selected = false;
    }

    get rowType(): ListRowLineType {
        return this._rowType;
    }

    set rowType(value: ListRowLineType) {
        this._rowType = value;
    }

    get isTotalRow(): boolean {
        return this._isTotalRow;
    }

    set isTotalRow(value: boolean) {
        this._isTotalRow = value;
    }

    get hasDate(): boolean {
        return this._hasDate;
    }

    set hasDate(value: boolean) {
        this._hasDate = value;
    }

    get dateDay(): string {
        return this._dateDay;
    }

    set dateDay(value: string) {
        this._dateDay = value;
    }

    get dateMonth(): string {
        return this._dateMonth;
    }

    set dateMonth(value: string) {
        this._dateMonth = value;
    }

    get dateYear(): string {
        return this._dateYear;
    }

    set dateYear(value: string) {
        this._dateYear = value;
    }

    get hasAccount(): boolean {
        return this._hasAccount;
    }

    set hasAccount(value: boolean) {
        this._hasAccount = value;
    }

    get account(): IAccount {
        return this._account;
    }

    set account(value: IAccount) {
        this._account = value;
    }

    get hasCategory(): boolean {
        return this._hasCategory;
    }

    set hasCategory(value: boolean) {
        this._hasCategory = value;
    }

    get category(): ICategory {
        return this._category;
    }

    set category(value: ICategory) {
        this._category = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }

    get amountDisplay(): string {
        return this._amountDisplay;
    }

    set amountDisplay(value: string) {
        this._amountDisplay = value;
    }

    get hasButtonOne(): boolean {
        return this._hasButtonOne;
    }

    set hasButtonOne(value: boolean) {
        this._hasButtonOne = value;
    }

    get enableButtonOne(): boolean {
        return this._enableButtonOne;
    }

    set enableButtonOne(value: boolean) {
        this._enableButtonOne = value;
    }

    get classButtonOne(): string {
        return this._classButtonOne;
    }

    set classButtonOne(value: string) {
        this._classButtonOne = value;
    }

    get hasButtonTwo(): boolean {
        return this._hasButtonTwo;
    }

    set hasButtonTwo(value: boolean) {
        this._hasButtonTwo = value;
    }

    get enableButtonTwo(): boolean {
        return this._enableButtonTwo;
    }

    set enableButtonTwo(value: boolean) {
        this._enableButtonTwo = value;
    }

    get classButtonTwo(): string {
        return this._classButtonTwo;
    }

    set classButtonTwo(value: string) {
        this._classButtonTwo = value;
    }

    get hasButtonThree(): boolean {
        return this._hasButtonThree;
    }

    set hasButtonThree(value: boolean) {
        this._hasButtonThree = value;
    }

    get enableButtonThree(): boolean {
        return this._enableButtonThree;
    }

    set enableButtonThree(value: boolean) {
        this._enableButtonThree = value;
    }

    get classButtonThree(): string {
        return this._classButtonThree;
    }

    set classButtonThree(value: string) {
        this._classButtonThree = value;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
    }
}
