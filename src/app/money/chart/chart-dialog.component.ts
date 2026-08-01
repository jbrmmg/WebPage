import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {NgChartsModule} from 'ng2-charts';
import {ChartData, ChartOptions, Chart, registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ITransactionReport, TransactionReport} from '../transaction/transactionReport';

Chart.register(...registerables, ChartDataLabels);

@Component({
    selector: 'jbr-chart-dialog',
    templateUrl: './chart-dialog.component.html',
    styleUrls: ['./chart-dialog.component.css'],
    standalone: true,
    imports: [NgIf, NgChartsModule]
})
export class ChartDialogComponent implements OnChanges {
    @Input() data: ITransactionReport[] = [];
    @Output() close = new EventEmitter<void>();

    chartType: 'pie' | 'line' | 'bar' = 'pie';

    pieChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
    lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
    barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    hasPieData = false;
    hasLineData = false;
    hasBarData = false;

    pieChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
            legend: { position: 'right' },
            datalabels: {
                display: 'auto',
                color: '#fff',
                font: { weight: 'bold', size: 11 },
                formatter: (value: number, ctx) => {
                    const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                    const pct = Math.round((value / total) * 100);
                    return pct >= 5 ? `${ctx.chart.data.labels?.[ctx.dataIndex]}\n${pct}%` : '';
                }
            }
        }
    };

    lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            datalabels: { display: false }
        },
        scales: { x: { ticks: { maxTicksLimit: 12 } } }
    };

    barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: { display: false },
            datalabels: { display: false }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    };

    ngOnChanges(): void {
        this.computePieData();
        this.computeLineData();
        this.computeDayOfWeekData();
    }

    private computePieData(): void {
        const transactions = (this.data ?? []).filter(t => t.type === TransactionReport.TRANSACTION);

        const netByCategory = new Map<string, { label: string; net: number; colour: string }>();

        for (const t of transactions) {
            const key = t.category?.id ?? '__none__';
            const label = t.category?.name ?? 'Uncategorised';
            const colour = t.category?.colour ? '#' + t.category.colour : '#999999';
            const amount = t.amount?.value ?? 0;

            if (!netByCategory.has(key)) {
                netByCategory.set(key, { label, net: 0, colour });
            }
            netByCategory.get(key).net += amount;
        }

        const spending = [...netByCategory.values()].filter(e => e.net < 0);
        spending.sort((a, b) => a.net - b.net);

        this.hasPieData = spending.length > 0;
        this.pieChartData = {
            labels: spending.map(e => e.label),
            datasets: [{
                data: spending.map(e => Math.round(Math.abs(e.net) * 100) / 100),
                backgroundColor: spending.map(e => e.colour)
            }]
        };
    }

    private computeLineData(): void {
        const transactions = (this.data ?? []).filter(t => t.type === TransactionReport.TRANSACTION);

        const dates: string[] = [];
        const seenDates = new Set<string>();
        for (const t of transactions) {
            if (t.date && !seenDates.has(t.date)) {
                seenDates.add(t.date);
                dates.push(t.date);
            }
        }

        this.hasLineData = dates.length > 0;
        if (!this.hasLineData) {
            this.lineChartData = { labels: [], datasets: [] };
            return;
        }

        const balanceByDate = new Map<string, number>();
        for (const t of transactions) {
            if (t.date && t.balance != null) {
                balanceByDate.set(t.date, t.balance.value);
            }
        }

        this.lineChartData = {
            labels: dates,
            datasets: [{
                label: 'Balance',
                data: dates.map(d => balanceByDate.get(d) ?? null),
                borderColor: '#4363d8',
                backgroundColor: 'rgba(67,99,216,0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        };
    }

    private computeDayOfWeekData(): void {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        const transactions = (this.data ?? []).filter(
            t => t.type === TransactionReport.TRANSACTION && (t.amount?.value ?? 0) < 0 && t.date && !t.oppositeId
        );

        // Collect categories in the order first encountered
        const categoryOrder: string[] = [];
        const categoryMeta = new Map<string, { label: string; colour: string }>();
        for (const t of transactions) {
            const key = t.category?.id ?? '__none__';
            if (!categoryMeta.has(key)) {
                categoryOrder.push(key);
                categoryMeta.set(key, {
                    label: t.category?.name ?? 'Uncategorised',
                    colour: t.category?.colour ? '#' + t.category.colour : '#999999'
                });
            }
        }

        // Accumulate spending per category per day
        const byCategory = new Map<string, number[]>();
        for (const key of categoryOrder) {
            byCategory.set(key, new Array(7).fill(0));
        }
        for (const t of transactions) {
            const key = t.category?.id ?? '__none__';
            const dow = (new Date(t.date).getDay() + 6) % 7;
            byCategory.get(key)[dow] += Math.abs(t.amount.value);
        }

        this.hasBarData = transactions.length > 0;
        this.barChartData = {
            labels: days,
            datasets: categoryOrder.map(key => {
                const meta = categoryMeta.get(key);
                return {
                    label: meta.label,
                    data: byCategory.get(key).map(v => Math.round(v * 100) / 100),
                    backgroundColor: meta.colour,
                    borderWidth: 0
                };
            })
        };
    }

}
