import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {NgIf} from "@angular/common";
import {FileInfoExtra} from "../../backup-fileinfoextra";

@Component({
    selector: 'jbr-backup-display-title',
    templateUrl: './backup-display-title.html',
    styleUrls: ['./backup-display-title.css'],
    standalone: true,
    imports: [
        NgIf
    ]
})
export class BackupDisplayTitle implements OnInit {
    @Input() selectedFile: FileInfoExtra;

    @Output() previousFile: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() nextFile: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() refresh: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() deleteFile: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() printFile: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();

    ngOnInit(): void {
    }

    previous() {
        this.previousFile.emit(this.selectedFile);
    }

    next() {
        this.nextFile.emit(this.selectedFile);
    }

    refreshData() {
        this.refresh.emit(this.selectedFile);
    }

    delete() {
        this.deleteFile.emit(this.selectedFile);
    }

    print() {
        this.printFile.emit(this.selectedFile);
    }
}
