jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICosts, Costs } from '../costs.model';
import { CostsService } from '../service/costs.service';

import { CostsRoutingResolveService } from './costs-routing-resolve.service';

describe('Service Tests', () => {
  describe('Costs routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CostsRoutingResolveService;
    let service: CostsService;
    let resultCosts: ICosts | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CostsRoutingResolveService);
      service = TestBed.inject(CostsService);
      resultCosts = undefined;
    });

    describe('resolve', () => {
      it('should return ICosts returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCosts = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCosts).toEqual({ id: 123 });
      });

      it('should return new ICosts if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCosts = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCosts).toEqual(new Costs());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Costs })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCosts = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCosts).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
