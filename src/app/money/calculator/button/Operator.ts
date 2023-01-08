import {Base} from "./base/Base";
import {IBase} from "./base/IBase";
import {OperatorType} from "../enum/OperatorType";
import {CalculatorService} from "../calculator-service";


export class Operator extends Base implements IBase {
    private readonly operator: OperatorType;

    constructor(operator: OperatorType,
                service: CalculatorService) {
        super(service,'col-3');
        this.operator = operator;

        switch (operator) {
            case OperatorType.ADD: {
                this.text = '+';
                break;
            }

            case OperatorType.MULTIPLY: {
                this.text = '*';
                break;
            }

            case OperatorType.SUBTRACT: {
                this.text = '-';
                break;
            }

            case OperatorType.DIVIDE: {
                this.text = '/';
                break;
            }

            default: {
                this.text = '?';
                break;
            }
        }
    }

    buttonClicked() {
        this._service.operator(this.operator);
    }
}
