import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BackupPrintService } from './backup-print-service';
import { environment } from '../../environments/environment';
import { PrintSize, SelectedPrint } from './backup-selectedprint';

describe('BackupPrintService', () => {
    let service: BackupPrintService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BackupPrintService]
        });
        service = TestBed.inject(BackupPrintService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('imageUrl()', () => {
        it('should return the test image URL in non-production mode', () => {
            expect(service.imageUrl(42)).toBe('api/backup/test.image.jpg');
        });
    });

    describe('getSelectedPhoto() / setSelectedPhoto()', () => {
        it('should return null before any photo is selected', () => {
            expect(service.getSelectedPhoto()).toBeNull();
        });

        it('should return the photo set via setSelectedPhoto()', () => {
            service.setSelectedPhoto(10, 'photo.jpg');
            const photo = service.getSelectedPhoto();
            expect(photo.fileId).toBe(10);
            expect(photo.fileName).toBe('photo.jpg');
        });

        it('should initialise border and blackWhite to false', () => {
            service.setSelectedPhoto(1, 'a.jpg');
            const photo = service.getSelectedPhoto();
            expect(photo.border).toBeFalse();
            expect(photo.blackWhite).toBeFalse();
        });

        it('should overwrite a previous selection', () => {
            service.setSelectedPhoto(1, 'first.jpg');
            service.setSelectedPhoto(2, 'second.jpg');
            expect(service.getSelectedPhoto().fileId).toBe(2);
            expect(service.getSelectedPhoto().fileName).toBe('second.jpg');
        });
    });

    describe('getSelectedPhotos()', () => {
        it('should be undefined before updatePrints() is called', () => {
            expect(service.getSelectedPhotos()).toBeUndefined();
        });
    });

    describe('getPrintSizes()', () => {
        it('should GET from prints.sizes and return the list', () => {
            const mockSizes: PrintSize[] = [{ id: 1, name: '4x6' }, { id: 2, name: '5x7' }];
            service.getPrintSizes().subscribe(sizes => {
                expect(sizes).toEqual(mockSizes);
            });
            const req = httpMock.expectOne(environment.backup.prints.sizes);
            expect(req.request.method).toBe('GET');
            req.flush(mockSizes);
        });

        it('should propagate HTTP errors', () => {
            let errorCaught = false;
            service.getPrintSizes().subscribe({ error: () => { errorCaught = true; } });
            const req = httpMock.expectOne(environment.backup.prints.sizes);
            req.flush('Error', { status: 500, statusText: 'Server Error' });
            expect(errorCaught).toBeTrue();
        });
    });

    describe('updatePrints()', () => {
        it('should GET from prints.url and store the result', () => {
            const mockPhotos: SelectedPrint[] = [
                { fileId: 1, fileName: 'a.jpg', sizeId: 1, sizeName: '4x6', border: false, blackWhite: false }
            ];
            service.updatePrints();
            const req = httpMock.expectOne(environment.backup.prints.url);
            expect(req.request.method).toBe('GET');
            req.flush(mockPhotos);
            expect(service.getSelectedPhotos()).toEqual(mockPhotos);
        });

        it('should emit printsUpdated after a successful GET', () => {
            let emitted = false;
            service.printsUpdated.subscribe(() => { emitted = true; });
            service.updatePrints();
            const req = httpMock.expectOne(environment.backup.prints.url);
            req.flush([]);
            expect(emitted).toBeTrue();
        });
    });

    describe('selectForPrint()', () => {
        it('should POST the selected photo to prints.url', () => {
            service.setSelectedPhoto(5, 'test.jpg');
            service.selectForPrint();
            const postReq = httpMock.expectOne(req => req.method === 'POST' && req.url === environment.backup.prints.url);
            expect(postReq.request.body.fileId).toBe(5);
            expect(postReq.request.body.fileName).toBe('test.jpg');
            postReq.flush(null);
            // selectForPrint calls updatePrints() on complete
            const getReq = httpMock.expectOne(req => req.method === 'GET' && req.url === environment.backup.prints.url);
            getReq.flush([]);
        });
    });

    describe('unselectForPrint()', () => {
        it('should POST the photo id to prints.unselect', () => {
            service.unselectForPrint(7);
            const postReq = httpMock.expectOne(environment.backup.prints.unselect);
            expect(postReq.request.method).toBe('POST');
            expect(postReq.request.body).toBe(7);
            postReq.flush(null);
            // unselectForPrint calls updatePrints() on complete
            const getReq = httpMock.expectOne(environment.backup.prints.url);
            getReq.flush([]);
        });
    });

    describe('updatedPrint()', () => {
        it('should PUT the print object to prints.url', () => {
            const print = new SelectedPrint();
            print.fileId = 3;
            print.sizeId = 2;
            service.updatedPrint(print);
            const req = httpMock.expectOne(req => req.method === 'PUT' && req.url === environment.backup.prints.url);
            expect(req.request.body.fileId).toBe(3);
            req.flush(null);
            // updatedPrint calls updatePrints() on complete
            const getReq = httpMock.expectOne(req => req.method === 'GET' && req.url === environment.backup.prints.url);
            getReq.flush([]);
        });
    });

    describe('clearPrints()', () => {
        it('should DELETE from prints.url', () => {
            service.clearPrints();
            const req = httpMock.expectOne(req => req.method === 'DELETE' && req.url === environment.backup.prints.url);
            req.flush(null);
            // clearPrints calls updatePrints() on complete
            const getReq = httpMock.expectOne(req => req.method === 'GET' && req.url === environment.backup.prints.url);
            getReq.flush([]);
        });
    });
});
