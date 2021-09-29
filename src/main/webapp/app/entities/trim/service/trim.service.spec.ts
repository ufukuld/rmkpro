import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FuelType } from 'app/entities/enumerations/fuel-type.model';
import { ITrim, Trim } from '../trim.model';

import { TrimService } from './trim.service';

describe('Service Tests', () => {
  describe('Trim Service', () => {
    let service: TrimService;
    let httpMock: HttpTestingController;
    let elemDefault: ITrim;
    let expectedResult: ITrim | ITrim[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TrimService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        label: 'AAAAAAA',
        doors: 0,
        seats: 0,
        engineDisplacementCc: 0,
        isAutomatic: false,
        fuelType: FuelType.PETROL,
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

      it('should create a Trim', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Trim()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Trim', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            label: 'BBBBBB',
            doors: 1,
            seats: 1,
            engineDisplacementCc: 1,
            isAutomatic: true,
            fuelType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Trim', () => {
        const patchObject = Object.assign(
          {
            label: 'BBBBBB',
            doors: 1,
            isAutomatic: true,
            fuelType: 'BBBBBB',
          },
          new Trim()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Trim', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            label: 'BBBBBB',
            doors: 1,
            seats: 1,
            engineDisplacementCc: 1,
            isAutomatic: true,
            fuelType: 'BBBBBB',
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

      it('should delete a Trim', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTrimToCollectionIfMissing', () => {
        it('should add a Trim to an empty array', () => {
          const trim: ITrim = { id: 123 };
          expectedResult = service.addTrimToCollectionIfMissing([], trim);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(trim);
        });

        it('should not add a Trim to an array that contains it', () => {
          const trim: ITrim = { id: 123 };
          const trimCollection: ITrim[] = [
            {
              ...trim,
            },
            { id: 456 },
          ];
          expectedResult = service.addTrimToCollectionIfMissing(trimCollection, trim);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Trim to an array that doesn't contain it", () => {
          const trim: ITrim = { id: 123 };
          const trimCollection: ITrim[] = [{ id: 456 }];
          expectedResult = service.addTrimToCollectionIfMissing(trimCollection, trim);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(trim);
        });

        it('should add only unique Trim to an array', () => {
          const trimArray: ITrim[] = [{ id: 123 }, { id: 456 }, { id: 73170 }];
          const trimCollection: ITrim[] = [{ id: 123 }];
          expectedResult = service.addTrimToCollectionIfMissing(trimCollection, ...trimArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const trim: ITrim = { id: 123 };
          const trim2: ITrim = { id: 456 };
          expectedResult = service.addTrimToCollectionIfMissing([], trim, trim2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(trim);
          expect(expectedResult).toContain(trim2);
        });

        it('should accept null and undefined values', () => {
          const trim: ITrim = { id: 123 };
          expectedResult = service.addTrimToCollectionIfMissing([], null, trim, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(trim);
        });

        it('should return initial array if no Trim is added', () => {
          const trimCollection: ITrim[] = [{ id: 123 }];
          expectedResult = service.addTrimToCollectionIfMissing(trimCollection, undefined, null);
          expect(expectedResult).toEqual(trimCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
