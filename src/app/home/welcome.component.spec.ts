import { WelcomeService } from './welcome.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Type } from '@angular/core';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeService', () => {
    let fixture: ComponentFixture<WelcomeComponent>;
    let app: WelcomeComponent;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
            ],
            declarations: [
                WelcomeComponent,
            ],
            providers: [
                WelcomeService,
            ]
        });

        await TestBed.compileComponents();

        fixture = TestBed.createComponent(WelcomeComponent);
        app = fixture.componentInstance;
        httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should call reminder', () => {
        app.textData1 = 'x';
        app.textData2 = 'y';
        app.onClick();

        const req = httpMock.expectOne('/podcast/reminder');
        req.flush('');
        expect(req.request.method).toBe('POST');
    });

    it('should call reminder and fail', () => {
        app.textData1 = 'x';
        app.textData2 = 'y';
        app.onClick();

        const req = httpMock.expectOne('/podcast/reminder');
        req.flush('', { status: 404, statusText: 'Invalid'});
        expect(req.request.method).toBe('POST');
    });
});
