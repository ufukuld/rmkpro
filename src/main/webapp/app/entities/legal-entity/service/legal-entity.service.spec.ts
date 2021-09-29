import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LegalEntityType } from 'app/entities/enumerations/legal-entity-type.model';
import { ILegalEntity, LegalEntity } from '../legal-entity.model';

import { LegalEntityService } from './legal-entity.service';

describe('Service Tests', () => {
  describe('LegalEntity Service', () => {
    let service: LegalEntityService;
    let httpMock: HttpTestingController;
    let elemDefault: ILegalEntity;
    let expectedResult: ILegalEntity | ILegalEntity[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LegalEntityService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        postCode: 'AAAAAAA',
        streetAddress: 'AAAAAAA',
        email: 'AAAAAAA',
        phone: 'AAAAAAA',
        type: LegalEntityType.PRIVATE_INDIVIDUAL,
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

      it('should create a LegalEntity', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new LegalEntity()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LegalEntity', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            postCode: 'BBBBBB',
            streetAddress: 'BBBBBB',
            email: 'BBBBBB',
            phone: 'BBBBBB',
            type: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a LegalEntity', () => {
        const patchObject = Object.assign(
          {
            type: 'BBBBBB',
          },
          new LegalEntity()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LegalEntity', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            postCode: 'BBBBBB',
            streetAddress: 'BBBBBB',
            email: 'BBBBBB',
            phone: 'BBBBBB',
            type: 'BBBBBB',
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

      it('should delete a LegalEntity', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLegalEntityToCollectionIfMissing', () => {
        it('should add a LegalEntity to an empty array', () => {
          const legalEntity: ILegalEntity = { id: 123 };
          expectedResult = service.addLegalEntityToCollectionIfMissing([], legalEntity);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(legalEntity);
        });

        it('should not add a LegalEntity to an array that contains it', () => {
          const legalEntity: ILegalEntity = { id: 123 };
          const legalEntityCollection: ILegalEntity[] = [
            {
              ...legalEntity,
            },
            { id: 456 },
          ];
          expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, legalEntity);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LegalEntity to an array that doesn't contain it", () => {
          const legalEntity: ILegalEntity = { id: 123 };
          const legalEntityCollection: ILegalEntity[] = [{ id: 456 }];
          expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, legalEntity);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(legalEntity);
        });

        it('should add only unique LegalEntity to an array', () => {
          const legalEntityArray: ILegalEntity[] = [{ id: 123 }, { id: 456 }, { id: 32750 }];
          const legalEntityCollection: ILegalEntity[] = [{ id: 123 }];
          expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, ...legalEntityArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const legalEntity: ILegalEntity = { id: 123 };
          const legalEntity2: ILegalEntity = { id: 456 };
          expectedResult = service.addLegalEntityToCollectionIfMissing([], legalEntity, legalEntity2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(legalEntity);
          expect(expectedResult).toContain(legalEntity2);
        });

        it('should accept null and undefined values', () => {
          const legalEntity: ILegalEntity = { id: 123 };
          expectedResult = service.addLegalEntityToCollectionIfMissing([], null, legalEntity, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(legalEntity);
        });

        it('should return initial array if no LegalEntity is added', () => {
          const legalEntityCollection: ILegalEntity[] = [{ id: 123 }];
          expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, undefined, null);
          expect(expectedResult).toEqual(legalEntityCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
