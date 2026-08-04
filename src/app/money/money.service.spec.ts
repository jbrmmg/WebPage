import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MoneyService } from './money.service';
import { environment } from '../../environments/environment';
import { TransactionReport, ITransactionReport } from './transaction/transactionReport';
import { ITransactionPage } from './transaction/transactionPage';
import { TransactionFilter } from './transaction/transactionFilter';
import { IFile } from './files/file';
import { IStatement } from './statement/statement';

describe('MoneyService', () => {
    let service: MoneyService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MoneyService]
        });
        service = TestBed.inject(MoneyService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('dateToString()', () => {
        it('should format date as YYYY-MM-DD with leading zeros', () => {
            const date = new Date(2024, 0, 5); // Jan 5 2024
            expect(MoneyService.dateToString(date)).toBe('2024-01-05');
        });

        it('should not pad two-digit month and day', () => {
            const date = new Date(2023, 11, 25); // Dec 25 2023
            expect(MoneyService.dateToString(date)).toBe('2023-12-25');
        });

        it('should pad single-digit month', () => {
            const date = new Date(2023, 8, 15); // Sep 15 2023
            expect(MoneyService.dateToString(date)).toBe('2023-09-15');
        });
    });

    describe('transferCategory()', () => {
        it('should return TRF', () => {
            expect(MoneyService.transferCategory()).toBe('TRF');
        });
    });

    describe('getAccountImage()', () => {
        it('should substitute ##id## with the provided id', () => {
            const result = MoneyService.getAccountImage('abc');
            expect(result).toContain('abc');
            expect(result).not.toContain('##id##');
        });
    });

    describe('getDisabledAccountImage()', () => {
        it('should substitute ##id## with the provided id', () => {
            const result = MoneyService.getDisabledAccountImage('xyz');
            expect(result).toContain('xyz');
            expect(result).not.toContain('##id##');
        });
    });

    describe('getDateString()', () => {
        it('should return ISO date part without time', () => {
            const date = new Date('2024-03-15T12:00:00Z');
            expect(MoneyService.getDateString(date)).toBe('2024-03-15');
        });
    });

    describe('getValidDateForMonth()', () => {
        it('should accept day 31 for 31-day months', () => {
            expect(MoneyService.getValidDateForMonth('31', 1, 2024)).toBe(31);
            expect(MoneyService.getValidDateForMonth('31', 3, 2024)).toBe(31);
            expect(MoneyService.getValidDateForMonth('31', 12, 2024)).toBe(31);
        });

        it('should reject day 32 for any month', () => {
            expect(MoneyService.getValidDateForMonth('32', 1, 2024)).toBe(0);
        });

        it('should accept day 30 for 30-day months', () => {
            expect(MoneyService.getValidDateForMonth('30', 4, 2024)).toBe(30);
            expect(MoneyService.getValidDateForMonth('30', 6, 2024)).toBe(30);
            expect(MoneyService.getValidDateForMonth('30', 9, 2024)).toBe(30);
            expect(MoneyService.getValidDateForMonth('30', 11, 2024)).toBe(30);
        });

        it('should reject day 31 for 30-day months', () => {
            expect(MoneyService.getValidDateForMonth('31', 4, 2024)).toBe(0);
            expect(MoneyService.getValidDateForMonth('31', 6, 2024)).toBe(0);
        });

        it('should accept days 1–28 for February', () => {
            expect(MoneyService.getValidDateForMonth('1', 2, 2024)).toBe(1);
            expect(MoneyService.getValidDateForMonth('28', 2, 2024)).toBe(28);
        });

        it('should reject day 29 for February (leap year logic in code is always false)', () => {
            // The code's leap year condition (divBy4 && !divBy100 && divBy400) is
            // always false because divBy400 implies divBy100, making !divBy100 false.
            expect(MoneyService.getValidDateForMonth('29', 2, 2024)).toBe(0);
        });

        it('should return 0 for day 0', () => {
            expect(MoneyService.getValidDateForMonth('0', 1, 2024)).toBe(0);
        });

        it('should return 0 for non-numeric input', () => {
            expect(MoneyService.getValidDateForMonth('abc', 1, 2024)).toBe(0);
        });
    });

    describe('isStringADate()', () => {
        it('should return null when parts count is not 3', () => {
            expect(MoneyService.isStringADate('2024-01')).toBeNull();
            expect(MoneyService.isStringADate('2024')).toBeNull();
        });

        it('should return null for non-numeric year', () => {
            expect(MoneyService.isStringADate('abcd-01-15')).toBeNull();
        });

        it('should return null for non-numeric month', () => {
            expect(MoneyService.isStringADate('2024-ab-15')).toBeNull();
        });

        it('should expand two-digit year by adding 2000', () => {
            expect(MoneyService.isStringADate('24-01-15')).toBe('2024-01-15');
        });

        it('should return null for year before 2010', () => {
            expect(MoneyService.isStringADate('2009-01-15')).toBeNull();
        });

        it('should return null for year after 2070', () => {
            expect(MoneyService.isStringADate('2071-01-15')).toBeNull();
        });

        it('should return null for month 0 or 13', () => {
            expect(MoneyService.isStringADate('2024-00-15')).toBeNull();
            expect(MoneyService.isStringADate('2024-13-15')).toBeNull();
        });

        it('should return null for day 31 in April (30-day month)', () => {
            expect(MoneyService.isStringADate('2024-04-31')).toBeNull();
        });

        it('should return formatted date string for a valid date', () => {
            expect(MoneyService.isStringADate('2024-06-15')).toBe('2024-06-15');
        });

        it('should accept boundary year 2010', () => {
            expect(MoneyService.isStringADate('2010-01-01')).toBe('2010-01-01');
        });

        it('should accept boundary year 2070', () => {
            expect(MoneyService.isStringADate('2070-12-31')).toBe('2070-12-31');
        });
    });

    describe('getFinanceValue()', () => {
        it('should parse a plain number', () => {
            expect(MoneyService.getFinanceValue('123.45')).toBe(123.45);
        });

        it('should strip the £ symbol', () => {
            expect(MoneyService.getFinanceValue('£50.00')).toBe(50);
        });

        it('should strip comma separators', () => {
            expect(MoneyService.getFinanceValue('1,000.00')).toBe(1000);
        });

        it('should return 0 for non-numeric input', () => {
            expect(MoneyService.getFinanceValue('abc')).toBe(0);
        });

        it('should return 0 for empty string', () => {
            expect(MoneyService.getFinanceValue('')).toBe(0);
        });

        it('should handle negative numbers', () => {
            expect(MoneyService.getFinanceValue('-25.50')).toBe(-25.5);
        });
    });

    describe('getBrightness()', () => {
        it('should return ~255 for white (FFFFFF)', () => {
            expect(MoneyService.getBrightness('FFFFFF')).toBeCloseTo(255, 0);
        });

        it('should return 0 for black (000000)', () => {
            expect(MoneyService.getBrightness('000000')).toBe(0);
        });

        it('should return a value between 0 and 255 for grey', () => {
            const brightness = MoneyService.getBrightness('808080');
            expect(brightness).toBeGreaterThan(0);
            expect(brightness).toBeLessThan(255);
        });
    });

    describe('getTextColor()', () => {
        it('should return black text (000000) for light colours', () => {
            expect(MoneyService.getTextColor('FFFFFF')).toBe('000000');
        });

        it('should return white text (FFFFFF) for dark colours', () => {
            expect(MoneyService.getTextColor('000000')).toBe('FFFFFF');
        });
    });

    describe('getTransactionDescription()', () => {
        it('should return the description for a TRANSACTION with text', () => {
            const tx = { type: TransactionReport.TRANSACTION, description: 'Coffee shop' } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('Coffee shop');
        });

        it('should return &nbsp; for a TRANSACTION with empty description', () => {
            const tx = { type: TransactionReport.TRANSACTION, description: '' } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('&nbsp;');
        });

        it('should return &nbsp; for a TRANSACTION with null description', () => {
            const tx = { type: TransactionReport.TRANSACTION, description: null } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('&nbsp;');
        });

        it('should return Opening Balance for OPEN_BALANCE type', () => {
            const tx = { type: TransactionReport.OPEN_BALANCE } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('Opening Balance');
        });

        it('should return Balance Today for TODAY_BALANCE type', () => {
            const tx = { type: TransactionReport.TODAY_BALANCE } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('Balance Today');
        });

        it('should return Future Balance for FUTURE_BALANCE type', () => {
            const tx = { type: TransactionReport.FUTURE_BALANCE } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('Future Balance');
        });

        it('should return &nbsp; for an unknown type', () => {
            const tx = { type: 'UNKNOWN' } as ITransactionReport;
            expect(MoneyService.getTransactionDescription(tx)).toBe('&nbsp;');
        });
    });

    describe('getDate()', () => {
        beforeEach(() => {
            jasmine.clock().install();
            // Use a midday UTC time to avoid timezone date-shift issues
            jasmine.clock().mockDate(new Date('2026-03-12T12:00:00Z'));
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('should return today for null', () => {
            expect(MoneyService.getDate(null)).toBe('2026-03-12');
        });

        it('should return today for empty string', () => {
            expect(MoneyService.getDate('')).toBe('2026-03-12');
        });

        it('should return today for "t"', () => {
            expect(MoneyService.getDate('t')).toBe('2026-03-12');
        });

        it('should return today for "T" (case-insensitive)', () => {
            expect(MoneyService.getDate('T')).toBe('2026-03-12');
        });

        it('should interpret a valid day number as a day in the current month', () => {
            expect(MoneyService.getDate('5')).toBe('2026-03-05');
        });

        it('should parse a full date string', () => {
            expect(MoneyService.getDate('2025-06-15')).toBe('2025-06-15');
        });

        it('should return today for an unrecognised string', () => {
            expect(MoneyService.getDate('not-a-date')).toBe('2026-03-12');
        });
    });

    describe('HTTP methods', () => {
        it('getFiles() should make a GET to moneyGetFilesUrl', () => {
            service.getFiles().subscribe();
            const req = httpMock.expectOne(environment.money.reconciliation.files);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('getCategories() should make a GET to moneyCategoryUrl', () => {
            service.getCategories().subscribe();
            const req = httpMock.expectOne(environment.money.categories);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('getAccounts() should make a GET to moneyAccountUrl', () => {
            service.getAccounts().subscribe();
            const req = httpMock.expectOne(environment.money.accounts);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('getStatements() should make a GET to moneyStatementUrl', () => {
            service.getStatements().subscribe();
            const req = httpMock.expectOne(environment.money.statement.url);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('getTransactions() should make a POST to moneyTransactionListPage and return ITransactionPage', () => {
            const filter = new TransactionFilter();
            let result: ITransactionPage;
            service.getTransactions(filter).subscribe(page => result = page);
            const req = httpMock.expectOne(environment.money.transaction.listPage);
            expect(req.request.method).toBe('POST');
            const mockPage: ITransactionPage = { totalCount: 1, pageNumber: 1, maxPageSize: 300, transactions: [] };
            req.flush(mockPage);
            expect(result.totalCount).toBe(1);
            expect(result.pageNumber).toBe(1);
            expect(result.transactions).toEqual([]);
        });

        it('getVersion() should make a GET to moneyVersion', () => {
            service.getVersion().subscribe();
            const req = httpMock.expectOne(environment.money.version);
            expect(req.request.method).toBe('GET');
            req.flush({ version: '1.0' });
        });

        it('addTransaction() should make a POST to moneyAddUrl', () => {
            service.addTransaction([]).subscribe();
            const req = httpMock.expectOne(environment.money.transaction.add);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('loadFileRequest() should POST to moneyLoadFileUrl with the filename', () => {
            const file = { filename: 'test.csv' } as IFile;
            service.loadFileRequest(file).subscribe();
            const req = httpMock.expectOne(environment.money.reconciliation.load);
            expect(req.request.method).toBe('POST');
            expect(req.request.body.filename).toBe('test.csv');
            req.flush({});
        });

        it('updateTransaction() should make a PUT to moneyUpdateTransactionUrl', () => {
            service.updateTransaction([]).subscribe();
            const req = httpMock.expectOne(environment.money.transaction.update);
            expect(req.request.method).toBe('PUT');
            req.flush({});
        });

        it('reconcile() should PUT transaction ids and flag to moneyReconcileTransactionUrl', () => {
            const tx = { transactionId: 42 } as ITransactionReport;
            service.reconcile([tx], true).subscribe();
            const req = httpMock.expectOne(environment.money.reconcile);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body.reconcile).toBeTrue();
            expect(req.request.body.transactions).toContain(42);
            req.flush({});
        });

        it('deleteTransaction() should DELETE with body containing transaction ids', () => {
            const tx = { transactionId: 7 } as ITransactionReport;
            service.deleteTransaction([tx]).subscribe();
            const req = httpMock.expectOne(environment.money.transaction.delete);
            expect(req.request.method).toBe('DELETE');
            expect(req.request.body[0].id).toBe(7);
            req.flush({});
        });

        it('lockStatement() should POST to moneyLockStatementUrl and set locked=true', () => {
            const stmt: IStatement = {
                accountId: 'ACC1', month: 3, year: 2026, openBalance: null, locked: false
            };
            service.lockStatement(stmt).subscribe();
            expect(stmt.locked).toBeTrue();
            const req = httpMock.expectOne(environment.money.statement.lock);
            expect(req.request.method).toBe('POST');
            expect(req.request.body.accountId).toBe('ACC1');
            expect(req.request.body.month).toBe(3);
            expect(req.request.body.year).toBe(2026);
            req.flush(null);
        });

        it('clearRecData() should make a DELETE to moneyClearDataUrl', () => {
            service.clearRecData().subscribe();
            const req = httpMock.expectOne(environment.money.reconciliation.clear);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });

        it('getFiles() should propagate HTTP errors', () => {
            let errorCaught = false;
            service.getFiles().subscribe({ error: () => { errorCaught = true; } });
            const req = httpMock.expectOne(environment.money.reconciliation.files);
            req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
            expect(errorCaught).toBeTrue();
        });

        it('getAccountImage() instance method should delegate to static method', () => {
            const result = service.getAccountImage('test-id');
            expect(result).toBe(MoneyService.getAccountImage('test-id'));
        });
    });
});
