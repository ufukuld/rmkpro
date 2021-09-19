jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VehicleService } from '../service/vehicle.service';
import { IVehicle, Vehicle } from '../vehicle.model';
import { IMake } from 'app/entities/make/make.model';
import { MakeService } from 'app/entities/make/service/make.service';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { LegalEntityService } from 'app/entities/legal-entity/service/legal-entity.service';

import { VehicleUpdateComponent } from './vehicle-update.component';

describe('Component Tests', () => {
  describe('Vehicle Management Update Component', () => {
    let comp: VehicleUpdateComponent;
    let fixture: ComponentFixture<VehicleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vehicleService: VehicleService;
    let makeService: MakeService;
    let legalEntityService: LegalEntityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehicleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VehicleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehicleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vehicleService = TestBed.inject(VehicleService);
      makeService = TestBed.inject(MakeService);
      legalEntityService = TestBed.inject(LegalEntityService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Make query and add missing value', () => {
        const vehicle: IVehicle = { id: 456 };
        const make: IMake = { id: 53280 };
        vehicle.make = make;

        const makeCollection: IMake[] = [{ id: 49995 }];
        jest.spyOn(makeService, 'query').mockReturnValue(of(new HttpResponse({ body: makeCollection })));
        const additionalMakes = [make];
        const expectedCollection: IMake[] = [...additionalMakes, ...makeCollection];
        jest.spyOn(makeService, 'addMakeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(makeService.query).toHaveBeenCalled();
        expect(makeService.addMakeToCollectionIfMissing).toHaveBeenCalledWith(makeCollection, ...additionalMakes);
        expect(comp.makesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call LegalEntity query and add missing value', () => {
        const vehicle: IVehicle = { id: 456 };
        const owner: ILegalEntity = { id: 99188 };
        vehicle.owner = owner;

        const legalEntityCollection: ILegalEntity[] = [{ id: 47985 }];
        jest.spyOn(legalEntityService, 'query').mockReturnValue(of(new HttpResponse({ body: legalEntityCollection })));
        const additionalLegalEntities = [owner];
        const expectedCollection: ILegalEntity[] = [...additionalLegalEntities, ...legalEntityCollection];
        jest.spyOn(legalEntityService, 'addLegalEntityToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(legalEntityService.query).toHaveBeenCalled();
        expect(legalEntityService.addLegalEntityToCollectionIfMissing).toHaveBeenCalledWith(
          legalEntityCollection,
          ...additionalLegalEntities
        );
        expect(comp.legalEntitiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vehicle: IVehicle = { id: 456 };
        const make: IMake = { id: 12866 };
        vehicle.make = make;
        const owner: ILegalEntity = { id: 61910 };
        vehicle.owner = owner;

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vehicle));
        expect(comp.makesSharedCollection).toContain(make);
        expect(comp.legalEntitiesSharedCollection).toContain(owner);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Vehicle>>();
        const vehicle = { id: 123 };
        jest.spyOn(vehicleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicle }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vehicleService.update).toHaveBeenCalledWith(vehicle);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Vehicle>>();
        const vehicle = new Vehicle();
        jest.spyOn(vehicleService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicle }));
        saveSubject.complete();

        // THEN
        expect(vehicleService.create).toHaveBeenCalledWith(vehicle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Vehicle>>();
        const vehicle = { id: 123 };
        jest.spyOn(vehicleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vehicleService.update).toHaveBeenCalledWith(vehicle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMakeById', () => {
        it('Should return tracked Make primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMakeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLegalEntityById', () => {
        it('Should return tracked LegalEntity primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLegalEntityById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
