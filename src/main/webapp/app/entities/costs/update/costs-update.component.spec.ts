jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CostsService } from '../service/costs.service';
import { ICosts, Costs } from '../costs.model';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';

import { CostsUpdateComponent } from './costs-update.component';

describe('Component Tests', () => {
  describe('Costs Management Update Component', () => {
    let comp: CostsUpdateComponent;
    let fixture: ComponentFixture<CostsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let costsService: CostsService;
    let vehicleService: VehicleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CostsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CostsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CostsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      costsService = TestBed.inject(CostsService);
      vehicleService = TestBed.inject(VehicleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vehicle query and add missing value', () => {
        const costs: ICosts = { id: 456 };
        const vehicle: IVehicle = { id: 66868 };
        costs.vehicle = vehicle;

        const vehicleCollection: IVehicle[] = [{ id: 54426 }];
        jest.spyOn(vehicleService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleCollection })));
        const additionalVehicles = [vehicle];
        const expectedCollection: IVehicle[] = [...additionalVehicles, ...vehicleCollection];
        jest.spyOn(vehicleService, 'addVehicleToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ costs });
        comp.ngOnInit();

        expect(vehicleService.query).toHaveBeenCalled();
        expect(vehicleService.addVehicleToCollectionIfMissing).toHaveBeenCalledWith(vehicleCollection, ...additionalVehicles);
        expect(comp.vehiclesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const costs: ICosts = { id: 456 };
        const vehicle: IVehicle = { id: 21419 };
        costs.vehicle = vehicle;

        activatedRoute.data = of({ costs });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(costs));
        expect(comp.vehiclesSharedCollection).toContain(vehicle);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Costs>>();
        const costs = { id: 123 };
        jest.spyOn(costsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ costs });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: costs }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(costsService.update).toHaveBeenCalledWith(costs);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Costs>>();
        const costs = new Costs();
        jest.spyOn(costsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ costs });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: costs }));
        saveSubject.complete();

        // THEN
        expect(costsService.create).toHaveBeenCalledWith(costs);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Costs>>();
        const costs = { id: 123 };
        jest.spyOn(costsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ costs });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(costsService.update).toHaveBeenCalledWith(costs);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVehicleById', () => {
        it('Should return tracked Vehicle primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVehicleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
