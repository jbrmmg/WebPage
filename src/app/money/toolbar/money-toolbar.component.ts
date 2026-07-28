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
    @Output() filterClick = new EventEmitter<void>();
    @Output() addClick = new EventEmitter<void>();
    @Output() transferClick = new EventEmitter<void>();
    @Output() saveClick = new EventEmitter<void>();
    @Output() recFileClick = new EventEmitter<void>();

    pageSize = 300;
    pageSizes = [25, 50, 100, 200, 300];

    onFilter() { this.filterClick.emit(); }
    onAdd() { this.addClick.emit(); }
    onTransfer() { this.transferClick.emit(); }
    onSave() { this.saveClick.emit(); }
    onExport() {}
    onLoadRecFile() { this.recFileClick.emit(); }
    onPageUp() {}
    onPageDown() {}
    onPageSizeChange() {}
}
