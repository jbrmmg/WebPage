import {ITransactionReport} from '../../transaction/transactionReport';
import {HeaderType} from '../header/grid-header-type';
import {GridDataActionType} from './grid-data-action-type';

export class GridDataEvent {
    transaction: ITransactionReport;
    source: HeaderType;
    action: GridDataActionType;
}
