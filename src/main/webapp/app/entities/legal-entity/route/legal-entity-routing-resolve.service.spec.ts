jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILegalEntity, LegalEntity } from '../legal-entity.model';
import { LegalEntityService } from '../service/legal-entity.service';

import { LegalEntityRoutingResolveService } from './legal-entity-routing-resolve.service';

describe('Service Tests', () => {
  describe('LegalEntity routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LegalEntityRoutingResolveService;
    let service: LegalEntityService;
    let resultLegalEntity: ILegalEntity | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LegalEntityRoutingResolveService);
      service = TestBed.inject(LegalEntityService);
      resultLegalEntity = undefined;
    });

    describe('resolve', () => {
      it('should return ILegalEntity returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLegalEntity = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLegalEntity).toEqual({ id: 123 });
      });

      it('should return new ILegalEntity if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLegalEntity = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLegalEntity).toEqual(new LegalEntity());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LegalEntity })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLegalEntity = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLegalEntity).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
