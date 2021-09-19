jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ModelService } from '../service/model.service';
import { IModel, Model } from '../model.model';
import { IMake } from 'app/entities/make/make.model';
import { MakeService } from 'app/entities/make/service/make.service';

import { ModelUpdateComponent } from './model-update.component';

describe('Component Tests', () => {
  describe('Model Management Update Component', () => {
    let comp: ModelUpdateComponent;
    let fixture: ComponentFixture<ModelUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let modelService: ModelService;
    let makeService: MakeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ModelUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ModelUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ModelUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      modelService = TestBed.inject(ModelService);
      makeService = TestBed.inject(MakeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Make query and add missing value', () => {
        const model: IModel = { id: 456 };
        const make: IMake = { id: 51270 };
        model.make = make;

        const makeCollection: IMake[] = [{ id: 46006 }];
        jest.spyOn(makeService, 'query').mockReturnValue(of(new HttpResponse({ body: makeCollection })));
        const additionalMakes = [make];
        const expectedCollection: IMake[] = [...additionalMakes, ...makeCollection];
        jest.spyOn(makeService, 'addMakeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ model });
        comp.ngOnInit();

        expect(makeService.query).toHaveBeenCalled();
        expect(makeService.addMakeToCollectionIfMissing).toHaveBeenCalledWith(makeCollection, ...additionalMakes);
        expect(comp.makesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const model: IModel = { id: 456 };
        const make: IMake = { id: 76278 };
        model.make = make;

        activatedRoute.data = of({ model });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(model));
        expect(comp.makesSharedCollection).toContain(make);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Model>>();
        const model = { id: 123 };
        jest.spyOn(modelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ model });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: model }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(modelService.update).toHaveBeenCalledWith(model);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Model>>();
        const model = new Model();
        jest.spyOn(modelService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ model });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: model }));
        saveSubject.complete();

        // THEN
        expect(modelService.create).toHaveBeenCalledWith(model);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Model>>();
        const model = { id: 123 };
        jest.spyOn(modelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ model });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(modelService.update).toHaveBeenCalledWith(model);
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
    });
  });
});
