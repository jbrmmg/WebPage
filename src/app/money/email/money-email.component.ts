import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IEmailReport, MoneyService} from '../money.service';

@Component({
    selector: 'jbr-money-email',
    templateUrl: './money-email.component.html',
    styleUrls: ['./money-email.component.css'],
    imports: [NgIf, NgForOf, FormsModule],
    standalone: true
})
export class MoneyEmailComponent implements OnInit {
    @Output() emailClosed = new EventEmitter<void>();

    reports: IEmailReport[] = [];
    selectedType: 'monthly' | 'annual' = 'monthly';
    selectedYear: number = null;
    selectedMonth: number = null;
    availableYears: number[] = [];
    availableMonths: number[] = [];

    email = '';
    validationError: string = null;
    sending = false;
    sent = false;

    readonly allMonths = [1,2,3,4,5,6,7,8,9,10,11,12];
    readonly monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    constructor(private readonly moneyService: MoneyService) {}

    ngOnInit(): void {
        this.moneyService.getEmailReports().subscribe({
            next: reports => {
                this.reports = reports;
                this.updateYears();
                this.updateMonths();
            }
        });
    }

    get selectedReport(): IEmailReport | null {
        const targetMonth = this.selectedType === 'annual' ? null : this.selectedMonth;
        return this.reports.find(r =>
            r.type === this.selectedType &&
            r.year === this.selectedYear &&
            r.month === targetMonth
        ) ?? null;
    }

    monthName(m: number): string {
        return this.monthNames[m - 1];
    }

    monthAvailable(m: number): boolean {
        return this.availableMonths.includes(m);
    }

    onTypeChange(): void {
        this.updateYears();
        this.updateMonths();
        this.validationError = null;
    }

    onYearChange(): void {
        this.updateMonths();
        this.validationError = null;
    }

    private updateYears(): void {
        const years = [...new Set(
            this.reports.filter(r => r.type === this.selectedType).map(r => r.year)
        )].sort((a, b) => b - a);
        this.availableYears = years;
        this.selectedYear = years[0] ?? null;
    }

    private updateMonths(): void {
        if (this.selectedType === 'annual') {
            this.selectedMonth = null;
            this.availableMonths = [];
            return;
        }
        const months = this.reports
            .filter(r => r.type === 'monthly' && r.year === this.selectedYear)
            .map(r => r.month)
            .sort((a, b) => a - b);
        this.availableMonths = months;
        this.selectedMonth = months[months.length - 1] ?? null;
    }

    private isValid(): boolean {
        if (!this.selectedReport) { this.validationError = 'No matching report found.'; return false; }
        if (!this.email?.trim()) { this.validationError = 'Email address is required.'; return false; }
        this.validationError = null;
        return true;
    }

    onSend(): void {
        if (!this.isValid()) { return; }
        this.sending = true;
        this.moneyService.sendEmail(this.selectedReport, this.email.trim()).subscribe({
            error: () => {
                this.sending = false;
                this.validationError = 'Send failed — check the log.';
            },
            complete: () => {
                this.sending = false;
                this.sent = true;
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') { this.emailClosed.emit(); }
    }

    onClose(): void {
        this.emailClosed.emit();
    }
}
