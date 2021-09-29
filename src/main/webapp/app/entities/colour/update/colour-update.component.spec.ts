jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ColourService } from '../service/colour.service';
import { IColour, Colour } from '../colour.model';

import { ColourUpdateComponent } from './colour-update.component';

describe('Component Tests', () => {
  describe('Colour Management Update Component', () => {
    let comp: ColourUpdateComponent;
    let fixture: ComponentFixture<ColourUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let colourService: ColourService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ColourUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ColourUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ColourUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      colourService = TestBed.inject(ColourService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const colour: IColour = { id: 456 };

        activatedRoute.data = of({ colour });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(colour));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Colour>>();
        const colour = { id: 123 };
        jest.spyOn(colourService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ colour });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: colour }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(colourService.update).toHaveBeenCalledWith(colour);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Colour>>();
        const colour = new Colour();
        jest.spyOn(colourService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ colour });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: colour }));
        saveSubject.complete();

        // THEN
        expect(colourService.create).toHaveBeenCalledWith(colour);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Colour>>();
        const colour = { id: 123 };
        jest.spyOn(colourService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ colour });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(colourService.update).toHaveBeenCalledWith(colour);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
