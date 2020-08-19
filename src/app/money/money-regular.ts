import {IAccount} from './money-account';
import {ICategory} from './money-category';

export interface IRegular {
    id: number;
    account: IAccount;
    amount: number;
    category: ICategory;
    frequency: string;
    weekendAdj: string;
    start: Date;
    lastDate: Date;
    description: string;
}
