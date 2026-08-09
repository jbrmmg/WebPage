import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
    selector: 'jbr-money-toolbar',
    templateUrl: './money-toolbar.component.html',
    styleUrls: ['./money-toolbar.component.css'],
    imports: [
        FormsModule,
        NgForOf
    ],
    standalone: true
})
export class MoneyToolbarComponent {
    @Input() status = '';
    @Input() version = '';
    @Input() hasChanges = false;
    @Input() currentPage = 1;
    @Input() totalPages = 1;
    @Input() pageSize = 300;
    @Output() filterClick = new EventEmitter<void>();
    @Output() addClick = new EventEmitter<void>();
    @Output() transferClick = new EventEmitter<void>();
    @Output() saveClick = new EventEmitter<void>();
    @Output() recFileClick = new EventEmitter<void>();
    @Output() prevClick = new EventEmitter<void>();
    @Output() nextClick = new EventEmitter<void>();
    @Output() pageSizeChange = new EventEmitter<number>();
    @Output() exportClick = new EventEmitter<void>();
    @Output() chartClick = new EventEmitter<void>();
    @Output() emailClick = new EventEmitter<void>();
    @Input() showChangesOnly = false;
    @Output() showChangesOnlyChange = new EventEmitter<boolean>();
    @Input() newestFirst = false;
    @Output() newestFirstChange = new EventEmitter<boolean>();

    pageSizes = [35, 70, 140, 200, 300];

    onFilter() { this.filterClick.emit(); }
    onAdd() { this.addClick.emit(); }
    onTransfer() { this.transferClick.emit(); }
    onSave() { this.saveClick.emit(); }
    onToggleChanges() { this.showChangesOnlyChange.emit(!this.showChangesOnly); }
    onToggleNewestFirst() { this.newestFirstChange.emit(!this.newestFirst); }
    onExport() { this.exportClick.emit(); }
    onChart() { this.chartClick.emit(); }
    onEmail() { this.emailClick.emit(); }
    onLoadRecFile() { this.recFileClick.emit(); }
    onPageUp() { this.prevClick.emit(); }
    onPageDown() { this.nextClick.emit(); }
    onPageSizeChange() { this.pageSizeChange.emit(this.pageSize); }
}
