import {OperatorType} from "./enum/OperatorType";
import {EventEmitter, Injectable, Output} from "@angular/core";

@Injectable({
    providedIn: null
})
export class CalculatorService {
    private debitValue: boolean;
    private value: number;
    private memory: number;
    private currentOperator: OperatorType;
    private keySequence: string[];

    constructor() {
        this.debitValue = true;
        this.clear();
    }

    @Output() statusChange: EventEmitter<any> = new EventEmitter();

    private get valueInProgress(): number {
        let sequence: string = "";

        this.keySequence.forEach( (k) => {
            sequence = sequence + k;
        })

        if(sequence === "." || sequence === "") {
            return 0;
        }

        return parseFloat(sequence);
    }

    private get maxFractionReached(): boolean {
        let hasDecimal: boolean = false;
        let fractionDigitCount: number = 0;

        this.keySequence.forEach((k) => {
            if (k === ".") {
                hasDecimal = true;
            } else {
                if (hasDecimal) {
                    fractionDigitCount++;
                }
            }
        })

        return fractionDigitCount >= 2;
    }

    private get containsDecimal(): boolean {
        this.keySequence.forEach((k) => {
            if (k === ".") {
                return true;
            }
        })

        return false;
    }

    private processOperator() {
        if(this.currentOperator != OperatorType.NONE) {
            switch (this.currentOperator) {
                case OperatorType.ADD:
                    this.value += this.memory;
                    break;
                case OperatorType.SUBTRACT:
                    this.value = this.memory - this.value;
                    break;
                case OperatorType.MULTIPLY:
                    this.value *= this.memory;
                    break;
                case OperatorType.DIVIDE:
                    this.value = this.memory / this.value;
                    break;
            }

            if(this.value < 0) {
                this.value *= -1;
                this.debitValue = !this.debitValue;
            }

            this.currentOperator = OperatorType.NONE;
        }
    }

    clear() {
        this.value = 0;
        this.memory = 0;
        this.keySequence = [];
        this.currentOperator = OperatorType.NONE;
        this.statusChange.emit(null);
    }

    operator(buttonOperator: OperatorType) {
        if (buttonOperator !== OperatorType.NONE) {
            if (this.keySequence.length > 0) {
                this.value = this.valueInProgress;
                this.keySequence = [];
            }

            this.processOperator();
            this.memory = this.value;
            this.value = 0;
        }

        this.keySequence = [];
        this.currentOperator = buttonOperator;
        this.statusChange.emit(null);
    }

    digit(value: number) {
        if(this.maxFractionReached) {
            return;
        }

        this.keySequence.push(value.toString());
        this.statusChange.emit(null);
    }

    decimal() {
        if(this.containsDecimal) {
            return;
        }

        this.keySequence.push(".");
        this.statusChange.emit(null);
    }

    debitCreditChange() {
        this.debitValue = !this.debitValue;
        this.statusChange.emit(null);
    }

    delete() {
        if(this.keySequence.length > 0) {
            this.keySequence.pop();
            this.statusChange.emit(null);
        }
    }

    calculate() {
        if (this.keySequence.length > 0) {
            this.value = this.valueInProgress;
            this.keySequence = [];
        }

        this.processOperator();
        this.memory = 0;

        this.statusChange.emit(null);
    }

    initialise(initialValue: string) {
        if(initialValue === "£0.00") {
            return;
        }

        console.log("Initialise  " + initialValue)
        this.debitValue = initialValue.startsWith("-");

        initialValue = initialValue.substring(this.debitValue ? 2 : 1);
        console.log("Initialise(2)  " + initialValue)
        this.value = parseFloat(initialValue);
        console.log("value  " + this.value)

        this.statusChange.emit(null);
    }

    get getValue(): number {
        if(this.keySequence.length > 0) {
            return this.valueInProgress;
        }

        return this.value;
    }

    get isDebitValue(): boolean {
        return this.debitValue;
    }
}
