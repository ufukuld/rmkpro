import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaintType } from 'app/entities/enumerations/paint-type.model';
import { IColour, Colour } from '../colour.model';

import { ColourService } from './colour.service';

describe('Service Tests', () => {
  describe('Colour Service', () => {
    let service: ColourService;
    let httpMock: HttpTestingController;
    let elemDefault: IColour;
    let expectedResult: IColour | IColour[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ColourService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        label: 'AAAAAAA',
        paintType: PaintType.SOLID,
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

      it('should create a Colour', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Colour()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Colour', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            label: 'BBBBBB',
            paintType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Colour', () => {
        const patchObject = Object.assign(
          {
            paintType: 'BBBBBB',
          },
          new Colour()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Colour', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            label: 'BBBBBB',
            paintType: 'BBBBBB',
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

      it('should delete a Colour', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addColourToCollectionIfMissing', () => {
        it('should add a Colour to an empty array', () => {
          const colour: IColour = { id: 123 };
          expectedResult = service.addColourToCollectionIfMissing([], colour);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(colour);
        });

        it('should not add a Colour to an array that contains it', () => {
          const colour: IColour = { id: 123 };
          const colourCollection: IColour[] = [
            {
              ...colour,
            },
            { id: 456 },
          ];
          expectedResult = service.addColourToCollectionIfMissing(colourCollection, colour);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Colour to an array that doesn't contain it", () => {
          const colour: IColour = { id: 123 };
          const colourCollection: IColour[] = [{ id: 456 }];
          expectedResult = service.addColourToCollectionIfMissing(colourCollection, colour);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(colour);
        });

        it('should add only unique Colour to an array', () => {
          const colourArray: IColour[] = [{ id: 123 }, { id: 456 }, { id: 67007 }];
          const colourCollection: IColour[] = [{ id: 123 }];
          expectedResult = service.addColourToCollectionIfMissing(colourCollection, ...colourArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const colour: IColour = { id: 123 };
          const colour2: IColour = { id: 456 };
          expectedResult = service.addColourToCollectionIfMissing([], colour, colour2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(colour);
          expect(expectedResult).toContain(colour2);
        });

        it('should accept null and undefined values', () => {
          const colour: IColour = { id: 123 };
          expectedResult = service.addColourToCollectionIfMissing([], null, colour, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(colour);
        });

        it('should return initial array if no Colour is added', () => {
          const colourCollection: IColour[] = [{ id: 123 }];
          expectedResult = service.addColourToCollectionIfMissing(colourCollection, undefined, null);
          expect(expectedResult).toEqual(colourCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
