import {Component, Input} from '@angular/core';
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

    pageSize = 300;
    pageSizes = [25, 50, 100, 200, 300];

    onFilter() {}
    onAdd() {}
    onSave() {}
    onExport() {}
    onPageUp() {}
    onPageDown() {}
    onPageSizeChange() {}
}
