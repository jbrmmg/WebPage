import {ITransactionReport} from "../../transaction/TransactionReport";
import {HeaderType} from "../header/grid-header-type";

export class GridDataChangeEvent {
    transaction: ITransactionReport;
    source: HeaderType;
}
