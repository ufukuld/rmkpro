import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICosts, Costs } from '../costs.model';

import { CostsService } from './costs.service';

describe('Service Tests', () => {
  describe('Costs Service', () => {
    let service: CostsService;
    let httpMock: HttpTestingController;
    let elemDefault: ICosts;
    let expectedResult: ICosts | ICosts[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CostsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        detail: 'AAAAAAA',
        unitPrice: 0,
        vatAmount: 0,
        vatPercentage: 0,
        netAmount: 0,
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

      it('should create a Costs', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Costs()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Costs', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            detail: 'BBBBBB',
            unitPrice: 1,
            vatAmount: 1,
            vatPercentage: 1,
            netAmount: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Costs', () => {
        const patchObject = Object.assign(
          {
            detail: 'BBBBBB',
            unitPrice: 1,
            vatAmount: 1,
            netAmount: 1,
          },
          new Costs()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Costs', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            detail: 'BBBBBB',
            unitPrice: 1,
            vatAmount: 1,
            vatPercentage: 1,
            netAmount: 1,
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

      it('should delete a Costs', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCostsToCollectionIfMissing', () => {
        it('should add a Costs to an empty array', () => {
          const costs: ICosts = { id: 123 };
          expectedResult = service.addCostsToCollectionIfMissing([], costs);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(costs);
        });

        it('should not add a Costs to an array that contains it', () => {
          const costs: ICosts = { id: 123 };
          const costsCollection: ICosts[] = [
            {
              ...costs,
            },
            { id: 456 },
          ];
          expectedResult = service.addCostsToCollectionIfMissing(costsCollection, costs);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Costs to an array that doesn't contain it", () => {
          const costs: ICosts = { id: 123 };
          const costsCollection: ICosts[] = [{ id: 456 }];
          expectedResult = service.addCostsToCollectionIfMissing(costsCollection, costs);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(costs);
        });

        it('should add only unique Costs to an array', () => {
          const costsArray: ICosts[] = [{ id: 123 }, { id: 456 }, { id: 18063 }];
          const costsCollection: ICosts[] = [{ id: 123 }];
          expectedResult = service.addCostsToCollectionIfMissing(costsCollection, ...costsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const costs: ICosts = { id: 123 };
          const costs2: ICosts = { id: 456 };
          expectedResult = service.addCostsToCollectionIfMissing([], costs, costs2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(costs);
          expect(expectedResult).toContain(costs2);
        });

        it('should accept null and undefined values', () => {
          const costs: ICosts = { id: 123 };
          expectedResult = service.addCostsToCollectionIfMissing([], null, costs, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(costs);
        });

        it('should return initial array if no Costs is added', () => {
          const costsCollection: ICosts[] = [{ id: 123 }];
          expectedResult = service.addCostsToCollectionIfMissing(costsCollection, undefined, null);
          expect(expectedResult).toEqual(costsCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
