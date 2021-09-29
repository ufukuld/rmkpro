jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VehicleService } from '../service/vehicle.service';
import { IVehicle, Vehicle } from '../vehicle.model';
import { ITrim } from 'app/entities/trim/trim.model';
import { TrimService } from 'app/entities/trim/service/trim.service';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { LegalEntityService } from 'app/entities/legal-entity/service/legal-entity.service';
import { IColour } from 'app/entities/colour/colour.model';
import { ColourService } from 'app/entities/colour/service/colour.service';

import { VehicleUpdateComponent } from './vehicle-update.component';

describe('Component Tests', () => {
  describe('Vehicle Management Update Component', () => {
    let comp: VehicleUpdateComponent;
    let fixture: ComponentFixture<VehicleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vehicleService: VehicleService;
    let trimService: TrimService;
    let legalEntityService: LegalEntityService;
    let colourService: ColourService;

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
      trimService = TestBed.inject(TrimService);
      legalEntityService = TestBed.inject(LegalEntityService);
      colourService = TestBed.inject(ColourService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Trim query and add missing value', () => {
        const vehicle: IVehicle = { id: 456 };
        const trim: ITrim = { id: 73818 };
        vehicle.trim = trim;

        const trimCollection: ITrim[] = [{ id: 46902 }];
        jest.spyOn(trimService, 'query').mockReturnValue(of(new HttpResponse({ body: trimCollection })));
        const additionalTrims = [trim];
        const expectedCollection: ITrim[] = [...additionalTrims, ...trimCollection];
        jest.spyOn(trimService, 'addTrimToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(trimService.query).toHaveBeenCalled();
        expect(trimService.addTrimToCollectionIfMissing).toHaveBeenCalledWith(trimCollection, ...additionalTrims);
        expect(comp.trimsSharedCollection).toEqual(expectedCollection);
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

      it('Should call Colour query and add missing value', () => {
        const vehicle: IVehicle = { id: 456 };
        const colour: IColour = { id: 72873 };
        vehicle.colour = colour;

        const colourCollection: IColour[] = [{ id: 9641 }];
        jest.spyOn(colourService, 'query').mockReturnValue(of(new HttpResponse({ body: colourCollection })));
        const additionalColours = [colour];
        const expectedCollection: IColour[] = [...additionalColours, ...colourCollection];
        jest.spyOn(colourService, 'addColourToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(colourService.query).toHaveBeenCalled();
        expect(colourService.addColourToCollectionIfMissing).toHaveBeenCalledWith(colourCollection, ...additionalColours);
        expect(comp.coloursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vehicle: IVehicle = { id: 456 };
        const trim: ITrim = { id: 91782 };
        vehicle.trim = trim;
        const owner: ILegalEntity = { id: 61910 };
        vehicle.owner = owner;
        const colour: IColour = { id: 75772 };
        vehicle.colour = colour;

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vehicle));
        expect(comp.trimsSharedCollection).toContain(trim);
        expect(comp.legalEntitiesSharedCollection).toContain(owner);
        expect(comp.coloursSharedCollection).toContain(colour);
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
      describe('trackTrimById', () => {
        it('Should return tracked Trim primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTrimById(0, entity);
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

      describe('trackColourById', () => {
        it('Should return tracked Colour primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackColourById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
