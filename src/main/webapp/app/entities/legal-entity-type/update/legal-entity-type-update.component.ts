import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILegalEntityType, LegalEntityType } from '../legal-entity-type.model';
import { LegalEntityTypeService } from '../service/legal-entity-type.service';

@Component({
  selector: 'jhi-legal-entity-type-update',
  templateUrl: './legal-entity-type-update.component.html',
})
export class LegalEntityTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required]],
  });

  constructor(
    protected legalEntityTypeService: LegalEntityTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalEntityType }) => {
      this.updateForm(legalEntityType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const legalEntityType = this.createFromForm();
    if (legalEntityType.id !== undefined) {
      this.subscribeToSaveResponse(this.legalEntityTypeService.update(legalEntityType));
    } else {
      this.subscribeToSaveResponse(this.legalEntityTypeService.create(legalEntityType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILegalEntityType>>): void {
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

  protected updateForm(legalEntityType: ILegalEntityType): void {
    this.editForm.patchValue({
      id: legalEntityType.id,
      label: legalEntityType.label,
    });
  }

  protected createFromForm(): ILegalEntityType {
    return {
      ...new LegalEntityType(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
