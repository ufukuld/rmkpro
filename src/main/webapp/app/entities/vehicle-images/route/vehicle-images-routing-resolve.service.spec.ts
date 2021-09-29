jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVehicleImages, VehicleImages } from '../vehicle-images.model';
import { VehicleImagesService } from '../service/vehicle-images.service';

import { VehicleImagesRoutingResolveService } from './vehicle-images-routing-resolve.service';

describe('Service Tests', () => {
  describe('VehicleImages routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VehicleImagesRoutingResolveService;
    let service: VehicleImagesService;
    let resultVehicleImages: IVehicleImages | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VehicleImagesRoutingResolveService);
      service = TestBed.inject(VehicleImagesService);
      resultVehicleImages = undefined;
    });

    describe('resolve', () => {
      it('should return IVehicleImages returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVehicleImages = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVehicleImages).toEqual({ id: 123 });
      });

      it('should return new IVehicleImages if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVehicleImages = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVehicleImages).toEqual(new VehicleImages());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as VehicleImages })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVehicleImages = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVehicleImages).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
