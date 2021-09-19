jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILegalEntityType, LegalEntityType } from '../legal-entity-type.model';
import { LegalEntityTypeService } from '../service/legal-entity-type.service';

import { LegalEntityTypeRoutingResolveService } from './legal-entity-type-routing-resolve.service';

describe('Service Tests', () => {
  describe('LegalEntityType routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LegalEntityTypeRoutingResolveService;
    let service: LegalEntityTypeService;
    let resultLegalEntityType: ILegalEntityType | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LegalEntityTypeRoutingResolveService);
      service = TestBed.inject(LegalEntityTypeService);
      resultLegalEntityType = undefined;
    });

    describe('resolve', () => {
      it('should return ILegalEntityType returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLegalEntityType = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLegalEntityType).toEqual({ id: 123 });
      });

      it('should return new ILegalEntityType if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLegalEntityType = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLegalEntityType).toEqual(new LegalEntityType());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LegalEntityType })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLegalEntityType = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLegalEntityType).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
