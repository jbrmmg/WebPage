import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BackupSearchService} from './backup-search.service';
import {BackupSearchRequest} from './backup-search-request';
import {BackupSearchResponse, BackupSearchResult} from './backup-search-response';
import {MapBounds} from '../map/map';
import {ILabel} from '../backup-label';

@Component({
    selector: 'jbr-backup-search',
    templateUrl: './backup-search.component.html',
    styleUrls: ['./backup-search.component.css']
})
export class BackupSearchComponent implements OnInit {
    filename = '';
    dateFrom: Date = null;
    dateTo: Date = null;
    sizeMin: number = null;
    sizeMax: number = null;
    expiryFrom: Date = null;
    expiryTo: Date = null;
    useLocation = false;
    private locationBounds: MapBounds = null;

    availableLabels: ILabel[] = [];
    selectedLabelIds = new Set<number>();

    page = 0;
    pageSize = 25;
    totalCount = 0;
    results: BackupSearchResult[] = [];
    searched = false;
    loading = false;

    readonly pageSizes = [25, 50, 100];

    readonly datePickerConfig = {
        dateInputFormat: 'DD-MMM-YYYY',
        containerClass: 'theme-dark-blue',
        selectFromOtherMonth: true
    };

    constructor(private readonly _searchService: BackupSearchService,
                private readonly datePipe: DatePipe) {}

    ngOnInit(): void {
        this._searchService.getLabels().subscribe(labels => {
            this.availableLabels = labels;
        });
    }

    isLabelSelected(label: ILabel): boolean {
        return this.selectedLabelIds.has(label.id);
    }

    toggleSearchLabel(label: ILabel): void {
        if (this.selectedLabelIds.has(label.id)) {
            this.selectedLabelIds.delete(label.id);
        } else {
            this.selectedLabelIds.add(label.id);
        }
        this.selectedLabelIds = new Set(this.selectedLabelIds);
    }

    clear(): void {
        this.filename = '';
        this.dateFrom = null;
        this.dateTo = null;
        this.sizeMin = null;
        this.sizeMax = null;
        this.expiryFrom = null;
        this.expiryTo = null;
        this.selectedLabelIds = new Set<number>();
        this.useLocation = false;
        this.locationBounds = null;
        this.results = [];
        this.totalCount = 0;
        this.searched = false;
        this.page = 0;
    }

    onBoundsChange(bounds: MapBounds): void {
        this.locationBounds = bounds;
    }

    get hasAnyCriteria(): boolean {
        return !!(this.filename
            || this.dateFrom || this.dateTo
            || this.sizeMin != null || this.sizeMax != null
            || this.expiryFrom || this.expiryTo
            || this.selectedLabelIds.size > 0
            || (this.useLocation && this.locationBounds));
    }

    get totalPages(): number {
        return Math.ceil(this.totalCount / this.pageSize);
    }

    get canPrev(): boolean { return this.page > 0; }
    get canNext(): boolean { return this.page < this.totalPages - 1; }

    search(resetPage = true): void {
        if (!this.hasAnyCriteria) return;
        if (resetPage) this.page = 0;
        this.loading = true;

        const request: BackupSearchRequest = { page: this.page, pageSize: this.pageSize };

        if (this.filename) request.filename = this.filename;
        if (this.dateFrom) request.dateFrom = this.dateFrom.toISOString();
        if (this.dateTo) request.dateTo = this.dateTo.toISOString();
        if (this.sizeMin != null) request.sizeMin = this.sizeMin;
        if (this.sizeMax != null) request.sizeMax = this.sizeMax;
        if (this.expiryFrom) request.expiryFrom = this.expiryFrom.toISOString();
        if (this.expiryTo) request.expiryTo = this.expiryTo.toISOString();
        if (this.selectedLabelIds.size > 0) {
            request.labels = this.availableLabels
                .filter(l => this.selectedLabelIds.has(l.id))
                .map(l => l.name);
        }
        if (this.useLocation && this.locationBounds) request.location = this.locationBounds;

        this._searchService.search(request).subscribe({
            next: (resp: BackupSearchResponse) => {
                this.results = resp.results;
                this.totalCount = resp.totalCount;
                this.searched = true;
                this.loading = false;
            },
            error: () => {
                this.results = [];
                this.totalCount = 0;
                this.searched = true;
                this.loading = false;
            }
        });
    }

    prevPage(): void {
        if (this.canPrev) { this.page--; this.search(false); }
    }

    nextPage(): void {
        if (this.canNext) { this.page++; this.search(false); }
    }

    onPageSizeChange(): void {
        this.search(true);
    }

    formatDate(dt: string): string {
        return this.datePipe.transform(dt, 'dd MMM yyyy') ?? '';
    }

    formatSize(bytes: number): string {
        if (bytes == null) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
}
