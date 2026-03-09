import { CalculatorService } from './calculator-service';
import { OperatorType } from './enum/OperatorType';
import { Digit } from './button/Digit';
import { Decimal } from './button/Decimal';
import { Delete } from './button/Delete';
import { Clear } from './button/Clear';
import { Equals } from './button/Equals';
import { Operator } from './button/Operator';
import { DebitCredit } from './button/DebitCredit';
import { Display } from './display/Display';

describe('CalculatorService', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    describe('initial state', () => {
        it('should start with value 0', () => {
            expect(service.getValue).toBe(0);
        });

        it('should start as debit', () => {
            expect(service.isDebitValue).toBeTrue();
        });
    });

    describe('digit()', () => {
        it('should update getValue after entering a digit', () => {
            service.digit(5);
            expect(service.getValue).toBe(5);
        });

        it('should build a multi-digit number', () => {
            service.digit(1);
            service.digit(2);
            service.digit(3);
            expect(service.getValue).toBe(123);
        });

        it('should allow up to 2 decimal places', () => {
            service.decimal();
            service.digit(1);
            service.digit(2);
            service.digit(9); // should be ignored
            expect(service.getValue).toBeCloseTo(0.12, 5);
        });

        it('should ignore a 3rd decimal digit', () => {
            service.digit(1);
            service.decimal();
            service.digit(2);
            service.digit(3);
            service.digit(4); // should be ignored
            expect(service.getValue).toBeCloseTo(1.23, 5);
        });
    });

    describe('decimal()', () => {
        it('should allow decimal entry', () => {
            service.digit(1);
            service.decimal();
            service.digit(5);
            expect(service.getValue).toBeCloseTo(1.5, 5);
        });

        it('should return 0 for bare decimal with no digits', () => {
            service.decimal();
            expect(service.getValue).toBe(0);
        });
    });

    describe('delete()', () => {
        it('should remove the last entered digit', () => {
            service.digit(1);
            service.digit(2);
            service.delete();
            expect(service.getValue).toBe(1);
        });

        it('should not fail when key sequence is empty', () => {
            expect(() => service.delete()).not.toThrow();
            expect(service.getValue).toBe(0);
        });
    });

    describe('clear()', () => {
        it('should reset value to 0', () => {
            service.digit(5);
            service.clear();
            expect(service.getValue).toBe(0);
        });

        it('should emit a status change', () => {
            let emitted = false;
            service.statusChange.subscribe(() => { emitted = true; });
            service.clear();
            expect(emitted).toBeTrue();
        });
    });

    describe('debitCreditChange()', () => {
        it('should toggle from debit to credit', () => {
            service.debitCreditChange();
            expect(service.isDebitValue).toBeFalse();
        });

        it('should toggle back to debit', () => {
            service.debitCreditChange();
            service.debitCreditChange();
            expect(service.isDebitValue).toBeTrue();
        });
    });

    describe('initialise()', () => {
        it('should set value from a positive number', () => {
            service.initialise(10.5);
            expect(service.getValue).toBeCloseTo(10.5, 5);
            expect(service.isDebitValue).toBeFalse();
        });

        it('should set value from a negative number and mark as debit', () => {
            service.initialise(-7.25);
            expect(service.getValue).toBeCloseTo(7.25, 5);
            expect(service.isDebitValue).toBeTrue();
        });

        it('should do nothing when initialised with 0', () => {
            service.digit(3);
            service.initialise(0.0);
            expect(service.getValue).toBe(3);
        });
    });

    describe('arithmetic operations', () => {
        it('should add two numbers', () => {
            service.digit(3);
            service.operator(OperatorType.ADD);
            service.digit(4);
            service.calculate();
            expect(service.getValue).toBe(7);
        });

        it('should subtract two numbers', () => {
            service.digit(9);
            service.operator(OperatorType.SUBTRACT);
            service.digit(3);
            service.calculate();
            expect(service.getValue).toBe(6);
        });

        it('should multiply two numbers', () => {
            service.digit(3);
            service.operator(OperatorType.MULTIPLY);
            service.digit(4);
            service.calculate();
            expect(service.getValue).toBe(12);
        });

        it('should divide two numbers', () => {
            service.digit(8);
            service.operator(OperatorType.DIVIDE);
            service.digit(4);
            service.calculate();
            expect(service.getValue).toBe(2);
        });

        it('should toggle debit when result is negative (subtract larger from smaller)', () => {
            service.digit(3);
            service.operator(OperatorType.SUBTRACT);
            service.digit(7);
            service.calculate();
            expect(service.getValue).toBe(4);
            expect(service.isDebitValue).toBeFalse(); // toggled because result was negative
        });

        it('should chain operations using operator()', () => {
            service.digit(2);
            service.operator(OperatorType.ADD);
            service.digit(3);
            service.operator(OperatorType.ADD); // triggers calculate of 2+3=5
            service.digit(1);
            service.calculate();
            expect(service.getValue).toBe(6);
        });
    });

    describe('calculate() with no operator', () => {
        it('should commit the in-progress value', () => {
            service.digit(4);
            service.digit(2);
            service.calculate();
            expect(service.getValue).toBe(42);
        });
    });
});

describe('Digit button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should have correct text', () => {
        const digit = new Digit(7, service);
        expect(digit.text).toBe('7');
    });

    it('should call service.digit on click', () => {
        spyOn(service, 'digit');
        const digit = new Digit(5, service);
        digit.buttonClicked();
        expect(service.digit).toHaveBeenCalledWith(5);
    });

    it('should match key press by its digit text', () => {
        const digit = new Digit(3, service);
        expect(digit.isLinkedKeyPress('3')).toBeTrue();
        expect(digit.isLinkedKeyPress('4')).toBeFalse();
    });
});

describe('Decimal button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should call service.decimal on click', () => {
        spyOn(service, 'decimal');
        const decimal = new Decimal(service);
        decimal.buttonClicked();
        expect(service.decimal).toHaveBeenCalled();
    });

    it('should match "." key press', () => {
        const decimal = new Decimal(service);
        expect(decimal.isLinkedKeyPress('.')).toBeTrue();
    });
});

describe('Delete button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should call service.delete on click', () => {
        spyOn(service, 'delete');
        const del = new Delete(service);
        del.buttonClicked();
        expect(service.delete).toHaveBeenCalled();
    });

    it('should match "Delete" key press', () => {
        const del = new Delete(service);
        expect(del.isLinkedKeyPress('Delete')).toBeTrue();
    });

    it('should not match other keys', () => {
        const del = new Delete(service);
        expect(del.isLinkedKeyPress('d')).toBeFalse();
    });
});

describe('Clear button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should call service.clear on click', () => {
        spyOn(service, 'clear');
        const clear = new Clear(service);
        clear.buttonClicked();
        expect(service.clear).toHaveBeenCalled();
    });

    it('should match "#" key press', () => {
        const clear = new Clear(service);
        expect(clear.isLinkedKeyPress('#')).toBeTrue();
    });

    it('should match its own text "CLR"', () => {
        const clear = new Clear(service);
        expect(clear.isLinkedKeyPress('CLR')).toBeTrue();
    });

    it('should not be an exit button', () => {
        const clear = new Clear(service);
        expect(clear.isExitButton()).toBeFalse();
    });
});

describe('Equals button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should call service.calculate on click', () => {
        spyOn(service, 'calculate');
        const equals = new Equals(service);
        equals.buttonClicked();
        expect(service.calculate).toHaveBeenCalled();
    });

    it('should match "Enter" key press', () => {
        const equals = new Equals(service);
        expect(equals.isLinkedKeyPress('Enter')).toBeTrue();
    });

    it('should match "=" key press', () => {
        const equals = new Equals(service);
        expect(equals.isLinkedKeyPress('=')).toBeTrue();
    });

    it('should be an exit button', () => {
        const equals = new Equals(service);
        expect(equals.isExitButton()).toBeTrue();
    });
});

describe('Operator button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should set text to "+" for ADD', () => {
        const op = new Operator(OperatorType.ADD, service);
        expect(op.text).toBe('+');
    });

    it('should set text to "-" for SUBTRACT', () => {
        const op = new Operator(OperatorType.SUBTRACT, service);
        expect(op.text).toBe('-');
    });

    it('should set text to "*" for MULTIPLY', () => {
        const op = new Operator(OperatorType.MULTIPLY, service);
        expect(op.text).toBe('*');
    });

    it('should set text to "/" for DIVIDE', () => {
        const op = new Operator(OperatorType.DIVIDE, service);
        expect(op.text).toBe('/');
    });

    it('should call service.operator on click', () => {
        spyOn(service, 'operator');
        const op = new Operator(OperatorType.ADD, service);
        op.buttonClicked();
        expect(service.operator).toHaveBeenCalledWith(OperatorType.ADD);
    });
});

describe('DebitCredit button', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should show "DB" when service is in debit mode', () => {
        const dc = new DebitCredit(service);
        expect(dc.text).toBe('DB');
    });

    it('should show "CR" when service is in credit mode', () => {
        service.debitCreditChange();
        const dc = new DebitCredit(service);
        expect(dc.text).toBe('CR');
    });

    it('should call service.debitCreditChange on click', () => {
        spyOn(service, 'debitCreditChange');
        const dc = new DebitCredit(service);
        dc.buttonClicked();
        expect(service.debitCreditChange).toHaveBeenCalled();
    });

    it('should match "c" key when in debit mode', () => {
        const dc = new DebitCredit(service);
        expect(service.isDebitValue).toBeTrue();
        expect(dc.isLinkedKeyPress('c')).toBeTrue();
        expect(dc.isLinkedKeyPress('C')).toBeTrue();
    });

    it('should match "d" key when in credit mode', () => {
        service.debitCreditChange();
        const dc = new DebitCredit(service);
        expect(dc.isLinkedKeyPress('d')).toBeTrue();
        expect(dc.isLinkedKeyPress('D')).toBeTrue();
    });

    it('should update text to "CR" after toggling to credit', () => {
        const dc = new DebitCredit(service);
        service.debitCreditChange(); // triggers statusChange -> handleChange
        expect(dc.text).toBe('CR');
    });
});

describe('Display', () => {
    let service: CalculatorService;

    beforeEach(() => {
        service = new CalculatorService();
    });

    it('should display "0.00" initially', () => {
        const display = new Display(service);
        expect(display.Text).toBe('0.00');
    });

    it('should display the current value formatted to 2dp', () => {
        const display = new Display(service);
        service.digit(4);
        service.digit(2);
        expect(display.Text).toBe('42.00');
    });

    it('should have debit CSS class when in debit mode', () => {
        const display = new Display(service);
        expect(display.Class).toBe('entry-calculator-db');
    });

    it('should have credit CSS class when in credit mode', () => {
        const display = new Display(service);
        service.debitCreditChange();
        expect(display.Class).toBe('entry-calculator');
    });
});
