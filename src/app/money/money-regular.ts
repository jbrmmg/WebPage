import {IAccount} from './money-jbaccount';
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
