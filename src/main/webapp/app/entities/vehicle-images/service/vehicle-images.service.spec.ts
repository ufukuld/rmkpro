import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVehicleImages, VehicleImages } from '../vehicle-images.model';

import { VehicleImagesService } from './vehicle-images.service';

describe('Service Tests', () => {
  describe('VehicleImages Service', () => {
    let service: VehicleImagesService;
    let httpMock: HttpTestingController;
    let elemDefault: IVehicleImages;
    let expectedResult: IVehicleImages | IVehicleImages[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VehicleImagesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        contentType: 'AAAAAAA',
        imageContentType: 'image/png',
        image: 'AAAAAAA',
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

      it('should create a VehicleImages', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new VehicleImages()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a VehicleImages', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            contentType: 'BBBBBB',
            image: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a VehicleImages', () => {
        const patchObject = Object.assign({}, new VehicleImages());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of VehicleImages', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            contentType: 'BBBBBB',
            image: 'BBBBBB',
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

      it('should delete a VehicleImages', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVehicleImagesToCollectionIfMissing', () => {
        it('should add a VehicleImages to an empty array', () => {
          const vehicleImages: IVehicleImages = { id: 123 };
          expectedResult = service.addVehicleImagesToCollectionIfMissing([], vehicleImages);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vehicleImages);
        });

        it('should not add a VehicleImages to an array that contains it', () => {
          const vehicleImages: IVehicleImages = { id: 123 };
          const vehicleImagesCollection: IVehicleImages[] = [
            {
              ...vehicleImages,
            },
            { id: 456 },
          ];
          expectedResult = service.addVehicleImagesToCollectionIfMissing(vehicleImagesCollection, vehicleImages);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a VehicleImages to an array that doesn't contain it", () => {
          const vehicleImages: IVehicleImages = { id: 123 };
          const vehicleImagesCollection: IVehicleImages[] = [{ id: 456 }];
          expectedResult = service.addVehicleImagesToCollectionIfMissing(vehicleImagesCollection, vehicleImages);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vehicleImages);
        });

        it('should add only unique VehicleImages to an array', () => {
          const vehicleImagesArray: IVehicleImages[] = [{ id: 123 }, { id: 456 }, { id: 59201 }];
          const vehicleImagesCollection: IVehicleImages[] = [{ id: 123 }];
          expectedResult = service.addVehicleImagesToCollectionIfMissing(vehicleImagesCollection, ...vehicleImagesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const vehicleImages: IVehicleImages = { id: 123 };
          const vehicleImages2: IVehicleImages = { id: 456 };
          expectedResult = service.addVehicleImagesToCollectionIfMissing([], vehicleImages, vehicleImages2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vehicleImages);
          expect(expectedResult).toContain(vehicleImages2);
        });

        it('should accept null and undefined values', () => {
          const vehicleImages: IVehicleImages = { id: 123 };
          expectedResult = service.addVehicleImagesToCollectionIfMissing([], null, vehicleImages, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vehicleImages);
        });

        it('should return initial array if no VehicleImages is added', () => {
          const vehicleImagesCollection: IVehicleImages[] = [{ id: 123 }];
          expectedResult = service.addVehicleImagesToCollectionIfMissing(vehicleImagesCollection, undefined, null);
          expect(expectedResult).toEqual(vehicleImagesCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
