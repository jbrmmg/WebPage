import {Component, OnInit} from '@angular/core';
import {BackupHardware} from './backup-hardware';
import {BackupHardwareService} from './backup-hardware.service';

@Component({
    selector: 'jbr-backup-hardware',
    templateUrl: './backup-hardware.component.html',
    styleUrls: ['./backup-hardware.component.css']
})
export class BackupHardwareComponent implements OnInit {
    hardware: BackupHardware[] = [];
    error = false;

    constructor(private readonly _service: BackupHardwareService) {}

    ngOnInit(): void {
        this._service.getHardware().subscribe({
            next: data => { this.hardware = data; },
            error: () => { this.error = true; }
        });
    }

    get reserved(): BackupHardware[] {
        return this.hardware.filter(h => h.reservedIP === 'Y');
    }

    get unreserved(): BackupHardware[] {
        return this.hardware.filter(h => h.reservedIP !== 'Y');
    }
}
