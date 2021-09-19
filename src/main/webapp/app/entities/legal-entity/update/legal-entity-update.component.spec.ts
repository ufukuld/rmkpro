jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LegalEntityService } from '../service/legal-entity.service';
import { ILegalEntity, LegalEntity } from '../legal-entity.model';
import { ILegalEntityType } from 'app/entities/legal-entity-type/legal-entity-type.model';
import { LegalEntityTypeService } from 'app/entities/legal-entity-type/service/legal-entity-type.service';

import { LegalEntityUpdateComponent } from './legal-entity-update.component';

describe('Component Tests', () => {
  describe('LegalEntity Management Update Component', () => {
    let comp: LegalEntityUpdateComponent;
    let fixture: ComponentFixture<LegalEntityUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let legalEntityService: LegalEntityService;
    let legalEntityTypeService: LegalEntityTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LegalEntityUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LegalEntityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LegalEntityUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      legalEntityService = TestBed.inject(LegalEntityService);
      legalEntityTypeService = TestBed.inject(LegalEntityTypeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call type query and add missing value', () => {
        const legalEntity: ILegalEntity = { id: 456 };
        const type: ILegalEntityType = { id: 48834 };
        legalEntity.type = type;

        const typeCollection: ILegalEntityType[] = [{ id: 22379 }];
        jest.spyOn(legalEntityTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: typeCollection })));
        const expectedCollection: ILegalEntityType[] = [type, ...typeCollection];
        jest.spyOn(legalEntityTypeService, 'addLegalEntityTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        expect(legalEntityTypeService.query).toHaveBeenCalled();
        expect(legalEntityTypeService.addLegalEntityTypeToCollectionIfMissing).toHaveBeenCalledWith(typeCollection, type);
        expect(comp.typesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const legalEntity: ILegalEntity = { id: 456 };
        const type: ILegalEntityType = { id: 70621 };
        legalEntity.type = type;

        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(legalEntity));
        expect(comp.typesCollection).toContain(type);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LegalEntity>>();
        const legalEntity = { id: 123 };
        jest.spyOn(legalEntityService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: legalEntity }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(legalEntityService.update).toHaveBeenCalledWith(legalEntity);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LegalEntity>>();
        const legalEntity = new LegalEntity();
        jest.spyOn(legalEntityService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: legalEntity }));
        saveSubject.complete();

        // THEN
        expect(legalEntityService.create).toHaveBeenCalledWith(legalEntity);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LegalEntity>>();
        const legalEntity = { id: 123 };
        jest.spyOn(legalEntityService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(legalEntityService.update).toHaveBeenCalledWith(legalEntity);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLegalEntityTypeById', () => {
        it('Should return tracked LegalEntityType primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLegalEntityTypeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
