import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LogsComponent} from './logs.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';
import {LogsService} from './logs.service';
import {Type} from '@angular/core';

describe('LogsService', () => {
    let fixture: ComponentFixture<LogsComponent>;
    let app: LogsComponent;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
            ],
            declarations: [
                LogsComponent,
            ],
            providers: [
                LogsService,
            ]
        });

        await TestBed.compileComponents();

        fixture = TestBed.createComponent(LogsComponent);
        app = fixture.componentInstance;
        httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });
});
