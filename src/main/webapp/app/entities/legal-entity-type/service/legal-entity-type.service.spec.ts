import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILegalEntityType, LegalEntityType } from '../legal-entity-type.model';

import { LegalEntityTypeService } from './legal-entity-type.service';

describe('Service Tests', () => {
  describe('LegalEntityType Service', () => {
    let service: LegalEntityTypeService;
    let httpMock: HttpTestingController;
    let elemDefault: ILegalEntityType;
    let expectedResult: ILegalEntityType | ILegalEntityType[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LegalEntityTypeService);
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

      it('should create a LegalEntityType', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new LegalEntityType()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LegalEntityType', () => {
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

      it('should partial update a LegalEntityType', () => {
        const patchObject = Object.assign({}, new LegalEntityType());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LegalEntityType', () => {
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

      it('should delete a LegalEntityType', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLegalEntityTypeToCollectionIfMissing', () => {
        it('should add a LegalEntityType to an empty array', () => {
          const legalEntityType: ILegalEntityType = { id: 123 };
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing([], legalEntityType);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(legalEntityType);
        });

        it('should not add a LegalEntityType to an array that contains it', () => {
          const legalEntityType: ILegalEntityType = { id: 123 };
          const legalEntityTypeCollection: ILegalEntityType[] = [
            {
              ...legalEntityType,
            },
            { id: 456 },
          ];
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing(legalEntityTypeCollection, legalEntityType);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LegalEntityType to an array that doesn't contain it", () => {
          const legalEntityType: ILegalEntityType = { id: 123 };
          const legalEntityTypeCollection: ILegalEntityType[] = [{ id: 456 }];
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing(legalEntityTypeCollection, legalEntityType);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(legalEntityType);
        });

        it('should add only unique LegalEntityType to an array', () => {
          const legalEntityTypeArray: ILegalEntityType[] = [{ id: 123 }, { id: 456 }, { id: 8732 }];
          const legalEntityTypeCollection: ILegalEntityType[] = [{ id: 123 }];
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing(legalEntityTypeCollection, ...legalEntityTypeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const legalEntityType: ILegalEntityType = { id: 123 };
          const legalEntityType2: ILegalEntityType = { id: 456 };
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing([], legalEntityType, legalEntityType2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(legalEntityType);
          expect(expectedResult).toContain(legalEntityType2);
        });

        it('should accept null and undefined values', () => {
          const legalEntityType: ILegalEntityType = { id: 123 };
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing([], null, legalEntityType, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(legalEntityType);
        });

        it('should return initial array if no LegalEntityType is added', () => {
          const legalEntityTypeCollection: ILegalEntityType[] = [{ id: 123 }];
          expectedResult = service.addLegalEntityTypeToCollectionIfMissing(legalEntityTypeCollection, undefined, null);
          expect(expectedResult).toEqual(legalEntityTypeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
