import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILegalEntity, LegalEntity } from '../legal-entity.model';
import { LegalEntityService } from '../service/legal-entity.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

@Component({
  selector: 'jhi-legal-entity-update',
  templateUrl: './legal-entity-update.component.html',
})
export class LegalEntityUpdateComponent implements OnInit {
  isSaving = false;

  peopleCollection: IPerson[] = [];
  companiesCollection: ICompany[] = [];

  editForm = this.fb.group({
    id: [],
    postCode: [null, [Validators.required]],
    streetAddress: [null, [Validators.required]],
    email: [null, [Validators.required]],
    phone: [],
    type: [],
    person: [],
    company: [],
  });

  constructor(
    protected legalEntityService: LegalEntityService,
    protected personService: PersonService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalEntity }) => {
      this.updateForm(legalEntity);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const legalEntity = this.createFromForm();
    if (legalEntity.id !== undefined) {
      this.subscribeToSaveResponse(this.legalEntityService.update(legalEntity));
    } else {
      this.subscribeToSaveResponse(this.legalEntityService.create(legalEntity));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackCompanyById(index: number, item: ICompany): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILegalEntity>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(legalEntity: ILegalEntity): void {
    this.editForm.patchValue({
      id: legalEntity.id,
      postCode: legalEntity.postCode,
      streetAddress: legalEntity.streetAddress,
      email: legalEntity.email,
      phone: legalEntity.phone,
      type: legalEntity.type,
      person: legalEntity.person,
      company: legalEntity.company,
    });

    this.peopleCollection = this.personService.addPersonToCollectionIfMissing(this.peopleCollection, legalEntity.person);
    this.companiesCollection = this.companyService.addCompanyToCollectionIfMissing(this.companiesCollection, legalEntity.company);
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query({ filter: 'legalentity-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleCollection = people));

    this.companyService
      .query({ filter: 'legalentity-is-null' })
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing(companies, this.editForm.get('company')!.value))
      )
      .subscribe((companies: ICompany[]) => (this.companiesCollection = companies));
  }

  protected createFromForm(): ILegalEntity {
    return {
      ...new LegalEntity(),
      id: this.editForm.get(['id'])!.value,
      postCode: this.editForm.get(['postCode'])!.value,
      streetAddress: this.editForm.get(['streetAddress'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      type: this.editForm.get(['type'])!.value,
      person: this.editForm.get(['person'])!.value,
      company: this.editForm.get(['company'])!.value,
    };
  }
}
