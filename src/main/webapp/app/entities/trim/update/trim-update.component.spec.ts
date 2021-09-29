jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TrimService } from '../service/trim.service';
import { ITrim, Trim } from '../trim.model';
import { IModel } from 'app/entities/model/model.model';
import { ModelService } from 'app/entities/model/service/model.service';

import { TrimUpdateComponent } from './trim-update.component';

describe('Component Tests', () => {
  describe('Trim Management Update Component', () => {
    let comp: TrimUpdateComponent;
    let fixture: ComponentFixture<TrimUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let trimService: TrimService;
    let modelService: ModelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TrimUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TrimUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TrimUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      trimService = TestBed.inject(TrimService);
      modelService = TestBed.inject(ModelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Model query and add missing value', () => {
        const trim: ITrim = { id: 456 };
        const model: IModel = { id: 24035 };
        trim.model = model;

        const modelCollection: IModel[] = [{ id: 73771 }];
        jest.spyOn(modelService, 'query').mockReturnValue(of(new HttpResponse({ body: modelCollection })));
        const additionalModels = [model];
        const expectedCollection: IModel[] = [...additionalModels, ...modelCollection];
        jest.spyOn(modelService, 'addModelToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ trim });
        comp.ngOnInit();

        expect(modelService.query).toHaveBeenCalled();
        expect(modelService.addModelToCollectionIfMissing).toHaveBeenCalledWith(modelCollection, ...additionalModels);
        expect(comp.modelsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const trim: ITrim = { id: 456 };
        const model: IModel = { id: 17709 };
        trim.model = model;

        activatedRoute.data = of({ trim });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(trim));
        expect(comp.modelsSharedCollection).toContain(model);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Trim>>();
        const trim = { id: 123 };
        jest.spyOn(trimService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ trim });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: trim }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(trimService.update).toHaveBeenCalledWith(trim);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Trim>>();
        const trim = new Trim();
        jest.spyOn(trimService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ trim });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: trim }));
        saveSubject.complete();

        // THEN
        expect(trimService.create).toHaveBeenCalledWith(trim);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Trim>>();
        const trim = { id: 123 };
        jest.spyOn(trimService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ trim });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(trimService.update).toHaveBeenCalledWith(trim);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackModelById', () => {
        it('Should return tracked Model primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackModelById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
