jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CompanyService } from '../service/company.service';
import { ICompany, Company } from '../company.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';

import { CompanyUpdateComponent } from './company-update.component';

describe('Component Tests', () => {
  describe('Company Management Update Component', () => {
    let comp: CompanyUpdateComponent;
    let fixture: ComponentFixture<CompanyUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let companyService: CompanyService;
    let personService: PersonService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CompanyUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CompanyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CompanyUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      companyService = TestBed.inject(CompanyService);
      personService = TestBed.inject(PersonService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Person query and add missing value', () => {
        const company: ICompany = { id: 456 };
        const contactPerson: IPerson = { id: 91559 };
        company.contactPerson = contactPerson;

        const personCollection: IPerson[] = [{ id: 60075 }];
        jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
        const additionalPeople = [contactPerson];
        const expectedCollection: IPerson[] = [...additionalPeople, ...personCollection];
        jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ company });
        comp.ngOnInit();

        expect(personService.query).toHaveBeenCalled();
        expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, ...additionalPeople);
        expect(comp.peopleSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const company: ICompany = { id: 456 };
        const contactPerson: IPerson = { id: 9109 };
        company.contactPerson = contactPerson;

        activatedRoute.data = of({ company });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(company));
        expect(comp.peopleSharedCollection).toContain(contactPerson);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Company>>();
        const company = { id: 123 };
        jest.spyOn(companyService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ company });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: company }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(companyService.update).toHaveBeenCalledWith(company);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Company>>();
        const company = new Company();
        jest.spyOn(companyService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ company });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: company }));
        saveSubject.complete();

        // THEN
        expect(companyService.create).toHaveBeenCalledWith(company);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Company>>();
        const company = { id: 123 };
        jest.spyOn(companyService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ company });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(companyService.update).toHaveBeenCalledWith(company);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPersonById', () => {
        it('Should return tracked Person primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPersonById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
