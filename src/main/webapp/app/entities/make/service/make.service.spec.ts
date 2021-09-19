import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMake, Make } from '../make.model';

import { MakeService } from './make.service';

describe('Service Tests', () => {
  describe('Make Service', () => {
    let service: MakeService;
    let httpMock: HttpTestingController;
    let elemDefault: IMake;
    let expectedResult: IMake | IMake[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MakeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        label: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Make', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Make()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Make', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            label: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Make', () => {
        const patchObject = Object.assign(
          {
            label: 'BBBBBB',
          },
          new Make()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Make', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            label: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Make', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMakeToCollectionIfMissing', () => {
        it('should add a Make to an empty array', () => {
          const make: IMake = { id: 123 };
          expectedResult = service.addMakeToCollectionIfMissing([], make);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(make);
        });

        it('should not add a Make to an array that contains it', () => {
          const make: IMake = { id: 123 };
          const makeCollection: IMake[] = [
            {
              ...make,
            },
            { id: 456 },
          ];
          expectedResult = service.addMakeToCollectionIfMissing(makeCollection, make);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Make to an array that doesn't contain it", () => {
          const make: IMake = { id: 123 };
          const makeCollection: IMake[] = [{ id: 456 }];
          expectedResult = service.addMakeToCollectionIfMissing(makeCollection, make);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(make);
        });

        it('should add only unique Make to an array', () => {
          const makeArray: IMake[] = [{ id: 123 }, { id: 456 }, { id: 25388 }];
          const makeCollection: IMake[] = [{ id: 123 }];
          expectedResult = service.addMakeToCollectionIfMissing(makeCollection, ...makeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const make: IMake = { id: 123 };
          const make2: IMake = { id: 456 };
          expectedResult = service.addMakeToCollectionIfMissing([], make, make2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(make);
          expect(expectedResult).toContain(make2);
        });

        it('should accept null and undefined values', () => {
          const make: IMake = { id: 123 };
          expectedResult = service.addMakeToCollectionIfMissing([], null, make, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(make);
        });

        it('should return initial array if no Make is added', () => {
          const makeCollection: IMake[] = [{ id: 123 }];
          expectedResult = service.addMakeToCollectionIfMissing(makeCollection, undefined, null);
          expect(expectedResult).toEqual(makeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
