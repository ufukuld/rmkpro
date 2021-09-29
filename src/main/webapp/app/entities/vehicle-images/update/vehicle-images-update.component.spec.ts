jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VehicleImagesService } from '../service/vehicle-images.service';
import { IVehicleImages, VehicleImages } from '../vehicle-images.model';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';

import { VehicleImagesUpdateComponent } from './vehicle-images-update.component';

describe('Component Tests', () => {
  describe('VehicleImages Management Update Component', () => {
    let comp: VehicleImagesUpdateComponent;
    let fixture: ComponentFixture<VehicleImagesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vehicleImagesService: VehicleImagesService;
    let vehicleService: VehicleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehicleImagesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VehicleImagesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehicleImagesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vehicleImagesService = TestBed.inject(VehicleImagesService);
      vehicleService = TestBed.inject(VehicleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vehicle query and add missing value', () => {
        const vehicleImages: IVehicleImages = { id: 456 };
        const vehicle: IVehicle = { id: 74523 };
        vehicleImages.vehicle = vehicle;

        const vehicleCollection: IVehicle[] = [{ id: 99087 }];
        jest.spyOn(vehicleService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleCollection })));
        const additionalVehicles = [vehicle];
        const expectedCollection: IVehicle[] = [...additionalVehicles, ...vehicleCollection];
        jest.spyOn(vehicleService, 'addVehicleToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicleImages });
        comp.ngOnInit();

        expect(vehicleService.query).toHaveBeenCalled();
        expect(vehicleService.addVehicleToCollectionIfMissing).toHaveBeenCalledWith(vehicleCollection, ...additionalVehicles);
        expect(comp.vehiclesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vehicleImages: IVehicleImages = { id: 456 };
        const vehicle: IVehicle = { id: 77949 };
        vehicleImages.vehicle = vehicle;

        activatedRoute.data = of({ vehicleImages });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vehicleImages));
        expect(comp.vehiclesSharedCollection).toContain(vehicle);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<VehicleImages>>();
        const vehicleImages = { id: 123 };
        jest.spyOn(vehicleImagesService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicleImages });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicleImages }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vehicleImagesService.update).toHaveBeenCalledWith(vehicleImages);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<VehicleImages>>();
        const vehicleImages = new VehicleImages();
        jest.spyOn(vehicleImagesService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicleImages });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicleImages }));
        saveSubject.complete();

        // THEN
        expect(vehicleImagesService.create).toHaveBeenCalledWith(vehicleImages);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<VehicleImages>>();
        const vehicleImages = { id: 123 };
        jest.spyOn(vehicleImagesService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicleImages });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vehicleImagesService.update).toHaveBeenCalledWith(vehicleImages);
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
