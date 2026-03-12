import {Component, Input} from '@angular/core';
import {HierarchyResponse} from '../../../backup-hierarchyresponse';

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export class BackupFileData {
    @Input() file: HierarchyResponse;
}
