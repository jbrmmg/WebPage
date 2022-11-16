import {ICategory} from './money-category';
import {IAccount} from './money-jbaccount';
import {ITransaction} from './list-row-line/list-row-summary';

export interface IMatch {
    transaction: ITransaction;
    beforeAmount: number;
    afterAmount: number;
    category: ICategory;
    description: string;
    colour: string;
    account: IAccount;
    date: Date;
    backwardAction: string;
    forwardAction: string;
    amount: number;
    id: number;
}

export class Match implements IMatch {
    public transaction: ITransaction;
    public beforeAmount: number;
    public afterAmount: number;
    public category: ICategory;
    public description: string;
    public colour: string;
    public account: IAccount;
    public date: Date;
    public backwardAction: string;
    public forwardAction: string;
    public amount: number;
    public id: number;
    public selected: boolean;

    constructor(source: IMatch) {
        this.transaction = source.transaction;
        this.beforeAmount = source.beforeAmount;
        this.afterAmount = source.afterAmount;
        this.category = source.category;
        this.description = source.description;
        this.colour = source.colour;
        this.account = source.account;
        this.date = source.date;
        this.backwardAction = source.backwardAction;
        this.forwardAction = source.forwardAction;
        this.amount = source.amount;
        this.id = source.id;
        this.selected = false;
    }

    get disabled() {
        return this.forwardAction === 'NONE';
    }

    get classIcon() {
        // SETCATEGORY, CREATE, RECONCILE, UNRECONCILE, NONE
        switch (this.forwardAction) {
            case 'SETCATEGORY':
                return 'fa fa-save';
            case 'CREATE':
                return 'fa fa-pencil';
            case 'RECONCILE':
                return 'fa fa-check';
            case 'UNRECONCILE':
                return 'fa fa-times';
        }

        return 'fa fa-lock';
    }
}
