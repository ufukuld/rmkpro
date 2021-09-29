jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LegalEntityService } from '../service/legal-entity.service';
import { ILegalEntity, LegalEntity } from '../legal-entity.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { LegalEntityUpdateComponent } from './legal-entity-update.component';

describe('Component Tests', () => {
  describe('LegalEntity Management Update Component', () => {
    let comp: LegalEntityUpdateComponent;
    let fixture: ComponentFixture<LegalEntityUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let legalEntityService: LegalEntityService;
    let personService: PersonService;
    let companyService: CompanyService;

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
      personService = TestBed.inject(PersonService);
      companyService = TestBed.inject(CompanyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call person query and add missing value', () => {
        const legalEntity: ILegalEntity = { id: 456 };
        const person: IPerson = { id: 30413 };
        legalEntity.person = person;

        const personCollection: IPerson[] = [{ id: 14338 }];
        jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
        const expectedCollection: IPerson[] = [person, ...personCollection];
        jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        expect(personService.query).toHaveBeenCalled();
        expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, person);
        expect(comp.peopleCollection).toEqual(expectedCollection);
      });

      it('Should call company query and add missing value', () => {
        const legalEntity: ILegalEntity = { id: 456 };
        const company: ICompany = { id: 3903 };
        legalEntity.company = company;

        const companyCollection: ICompany[] = [{ id: 7834 }];
        jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
        const expectedCollection: ICompany[] = [company, ...companyCollection];
        jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        expect(companyService.query).toHaveBeenCalled();
        expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(companyCollection, company);
        expect(comp.companiesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const legalEntity: ILegalEntity = { id: 456 };
        const person: IPerson = { id: 71153 };
        legalEntity.person = person;
        const company: ICompany = { id: 89483 };
        legalEntity.company = company;

        activatedRoute.data = of({ legalEntity });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(legalEntity));
        expect(comp.peopleCollection).toContain(person);
        expect(comp.companiesCollection).toContain(company);
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
      describe('trackPersonById', () => {
        it('Should return tracked Person primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPersonById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCompanyById', () => {
        it('Should return tracked Company primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCompanyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
