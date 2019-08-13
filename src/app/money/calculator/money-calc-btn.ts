
export enum CalculatorOperator {
    NONE,
    ADD,
    SUBTRACT,
    MULTIPLY,
    DIVIDE
}

export enum CalculatorButtonType {
    CLEAR,
    DEBIT,
    DELETE,
    DECIMAL,
    EQUAL,
    NUMBER,
    OPERATOR
}

export interface IMoneyCalcButton {
    value: number;
    className: string;
    operatorAction: CalculatorOperator;
    buttonType: CalculatorButtonType;
    text: string;
    buttonStyle: string;

    buttonClicked();
}

export class MoneyCalcButton implements IMoneyCalcButton {
    value : number;
    className : string;
    operatorAction: CalculatorOperator;
    buttonType: CalculatorButtonType;
    buttonStyle: string;
    text: string;
    status: MoneyCalcButtonStatus;

    constructor(value: number,
                className: string,
                operatorAction: CalculatorOperator,
                buttonType: CalculatorButtonType,
                status: MoneyCalcButtonStatus ) {
        this.value = value;
        this.className = className;
        this.operatorAction = operatorAction;
        this.buttonType = buttonType;
        this.buttonStyle = "btn btn-primary btn-calculator";
        this.status = status;
    }

    buttonClicked() {
        this.status.appendDisplay(this.text);
    }
}

export class MoneyCalcButtonNumber extends MoneyCalcButton {

    constructor(value: number,
                status: MoneyCalcButtonStatus) {
        super(value,"col-3", CalculatorOperator.NONE, CalculatorButtonType.NUMBER, status );
        this.text = value.toString();
    }
}

export class MoneyCalcButtonOperator extends MoneyCalcButton implements IMoneyCalcButton {
    constructor(operator: CalculatorOperator,
                status: MoneyCalcButtonStatus) {
        super(-1,"col-3",operator,CalculatorButtonType.OPERATOR,status);

        switch(operator) {
            case CalculatorOperator.ADD: {
                this.text = "+";
                break;
            }

            case CalculatorOperator.MULTIPLY: {
                this.text = "*";
                break;
            }

            case CalculatorOperator.SUBTRACT: {
                this.text = "-";
                break;
            }

            case CalculatorOperator.DIVIDE: {
                this.text = "/";
                break;
            }

            default: {
                this.text = "?";
                break;
            }
        }
    }

    buttonClicked() {
        this.status.resetOperator(this.operatorAction);
    }
}

export class MoneyCalcButtonDelete extends MoneyCalcButton implements IMoneyCalcButton {
    constructor(status: MoneyCalcButtonStatus) {
        super(-1,"col-3",CalculatorOperator.NONE,CalculatorButtonType.DELETE,status);
        this.text = "DEL";
    }

    buttonClicked() {
        this.status.removeLastDisplay();
    }
}

export class MoneyCalcButtonEquals extends MoneyCalcButton implements IMoneyCalcButton {
    constructor(status: MoneyCalcButtonStatus) {
        super(-1,"col-3",CalculatorOperator.NONE,CalculatorButtonType.EQUAL,status);
        this.text = "=";
    }

    buttonClicked() {
        this.status.calculate();
        this.status.resetOperator(this.operatorAction);
    }
}

export class MoneyCalcButtonClear extends MoneyCalcButton implements IMoneyCalcButton {
    constructor(status: MoneyCalcButtonStatus) {
        super(-1,"col-6",CalculatorOperator.NONE,CalculatorButtonType.CLEAR,status);
        this.text = "CLR";
    }

    buttonClicked() {
        this.status.clear();
    }
}

export class MoneyCalcButtonDebit extends MoneyCalcButton implements IMoneyCalcButton {
    constructor(status: MoneyCalcButtonStatus) {
        super(-1,"col-3",CalculatorOperator.NONE,CalculatorButtonType.DEBIT,status);
        this.statusUpdate();
    }

    buttonClicked() {
        this.status.switchDebit();
        this.statusUpdate();
    }

    statusUpdate() {
        if(!this.status.debit) {
            this.text = "CR";
            this.buttonStyle = "btn btn-primary btn-calculator";
        } else {
            this.text = "DB";
            this.buttonStyle = "btn btn-primary btn-calculator-db";
        }
    }
}

export class MoneyCalcButtonDecimal extends MoneyCalcButton implements IMoneyCalcButton {

    constructor(status: MoneyCalcButtonStatus) {
        super(-1,"col-3",CalculatorOperator.NONE,CalculatorButtonType.DECIMAL,status);
        this.text = ".";
    }

    buttonClicked() {
        // If there isn't currently a decimal place, add it now.
        if(!this.status.display.includes(this.text) || this.status.display == "0.00") {
            this.status.appendDisplay(this.text);
        }
    }
}

export class MoneyCalcButtonStatus {
    private debitStatus: boolean;
    private unformattedDisplay: string;
    private memory: number;
    private currentOperator: CalculatorOperator;
    private debitButtonInternal: MoneyCalcButtonDebit = null;

    constructor() {
        this.debitStatus = true;
        this.clear();
    }

    set debitButton(value: MoneyCalcButtonDebit) {
        this.debitButtonInternal = value;
    }

    get display() : string {
        if(this.unformattedDisplay == "0") {
            return "0.00";
        }

        if(this.unformattedDisplay.endsWith("."))
        {
            return this.unformattedDisplay + "0";
        }

        if(this.unformattedDisplay.endsWith("\n"))
        {
            let value: number = parseFloat(this.unformattedDisplay);
            return value.toFixed(2);
        }

        return this.unformattedDisplay;
    }

    clear() {
        this.unformattedDisplay = "0";
        this.memory = 0;
        this.resetOperator(CalculatorOperator.NONE);
    }

    resetOperator(buttonOperator: CalculatorOperator) {
        if(buttonOperator != CalculatorOperator.NONE) {
            // Store the current value in memory.
            this.memory = parseFloat(this.display);
            this.unformattedDisplay += "\n";
        }

        this.currentOperator = buttonOperator;
    }

    appendDisplay(newChar: string){
        if(this.unformattedDisplay.endsWith("\n")) {

            this.unformattedDisplay = newChar;
        } else {
            if(this.unformattedDisplay == "0") {
                if(newChar == ".") {
                    this.unformattedDisplay = "0.";
                    console.info("Here")
                } else {
                    this.unformattedDisplay = newChar;
                }
            } else {
                this.unformattedDisplay += newChar;
            }
        }
    }

    switchDebit() {
        this.debitStatus = !this.debitStatus;

        let value : number = parseFloat(this.display);
        this.unformattedDisplay = value.toFixed(2) + "\n";
    }

    get debit() : boolean {
        return this.debitStatus;
    }

    removeLastDisplay() {
        if(this.unformattedDisplay.length > 1) {
            this.unformattedDisplay = this.unformattedDisplay.substring(0,this.unformattedDisplay.length-1);
        }
    }

    calculate() {
        let value : number = parseFloat(this.display);

        console.info("Operator " + this.currentOperator.toString());

        // Calculate the value.
        if(this.currentOperator != CalculatorOperator.NONE) {
            switch(this.currentOperator) {
                case CalculatorOperator.ADD: {
                    value += this.memory;
                    this.memory = value;
                    break;
                }
                case CalculatorOperator.MULTIPLY: {
                    value *= this.memory;
                    this.memory = value;
                    break;
                }
                case CalculatorOperator.SUBTRACT: {
                    value = this.memory - value;
                    this.memory = value;
                    break;
                }
                case CalculatorOperator.DIVIDE: {
                    value = this.memory / value;
                    this.memory = value;
                    break;
                }
            }
        }

        // If negative, switch the debit flag.
        if(value < 0) {
            value *= -1;
            this.debitStatus = !this.debitStatus;
            if(this.debitButtonInternal != null) {
                this.debitButtonInternal.statusUpdate();
            }
        }

        // Display the result.
        this.unformattedDisplay = value.toFixed(2) + "\n";
    }
}
