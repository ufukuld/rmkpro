jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LegalEntityTypeService } from '../service/legal-entity-type.service';
import { ILegalEntityType, LegalEntityType } from '../legal-entity-type.model';

import { LegalEntityTypeUpdateComponent } from './legal-entity-type-update.component';

describe('Component Tests', () => {
  describe('LegalEntityType Management Update Component', () => {
    let comp: LegalEntityTypeUpdateComponent;
    let fixture: ComponentFixture<LegalEntityTypeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let legalEntityTypeService: LegalEntityTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LegalEntityTypeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LegalEntityTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LegalEntityTypeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      legalEntityTypeService = TestBed.inject(LegalEntityTypeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const legalEntityType: ILegalEntityType = { id: 456 };

        activatedRoute.data = of({ legalEntityType });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(legalEntityType));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LegalEntityType>>();
        const legalEntityType = { id: 123 };
        jest.spyOn(legalEntityTypeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ legalEntityType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: legalEntityType }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(legalEntityTypeService.update).toHaveBeenCalledWith(legalEntityType);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LegalEntityType>>();
        const legalEntityType = new LegalEntityType();
        jest.spyOn(legalEntityTypeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ legalEntityType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: legalEntityType }));
        saveSubject.complete();

        // THEN
        expect(legalEntityTypeService.create).toHaveBeenCalledWith(legalEntityType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LegalEntityType>>();
        const legalEntityType = { id: 123 };
        jest.spyOn(legalEntityTypeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ legalEntityType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(legalEntityTypeService.update).toHaveBeenCalledWith(legalEntityType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
