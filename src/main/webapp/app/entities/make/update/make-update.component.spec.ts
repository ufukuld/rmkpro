jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MakeService } from '../service/make.service';
import { IMake, Make } from '../make.model';

import { MakeUpdateComponent } from './make-update.component';

describe('Component Tests', () => {
  describe('Make Management Update Component', () => {
    let comp: MakeUpdateComponent;
    let fixture: ComponentFixture<MakeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let makeService: MakeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MakeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MakeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MakeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      makeService = TestBed.inject(MakeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const make: IMake = { id: 456 };

        activatedRoute.data = of({ make });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(make));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Make>>();
        const make = { id: 123 };
        jest.spyOn(makeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ make });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: make }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(makeService.update).toHaveBeenCalledWith(make);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Make>>();
        const make = new Make();
        jest.spyOn(makeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ make });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: make }));
        saveSubject.complete();

        // THEN
        expect(makeService.create).toHaveBeenCalledWith(make);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Make>>();
        const make = { id: 123 };
        jest.spyOn(makeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ make });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(makeService.update).toHaveBeenCalledWith(make);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
