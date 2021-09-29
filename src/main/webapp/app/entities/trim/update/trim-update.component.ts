import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITrim, Trim } from '../trim.model';
import { TrimService } from '../service/trim.service';
import { IModel } from 'app/entities/model/model.model';
import { ModelService } from 'app/entities/model/service/model.service';

@Component({
  selector: 'jhi-trim-update',
  templateUrl: './trim-update.component.html',
})
export class TrimUpdateComponent implements OnInit {
  isSaving = false;

  modelsSharedCollection: IModel[] = [];

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required]],
    doors: [null, [Validators.required]],
    seats: [null, [Validators.required]],
    engineDisplacementCc: [null, [Validators.required]],
    isAutomatic: [],
    fuelType: [null, [Validators.required]],
    model: [],
  });

  constructor(
    protected trimService: TrimService,
    protected modelService: ModelService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trim }) => {
      this.updateForm(trim);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trim = this.createFromForm();
    if (trim.id !== undefined) {
      this.subscribeToSaveResponse(this.trimService.update(trim));
    } else {
      this.subscribeToSaveResponse(this.trimService.create(trim));
    }
  }

  trackModelById(index: number, item: IModel): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrim>>): void {
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

  protected updateForm(trim: ITrim): void {
    this.editForm.patchValue({
      id: trim.id,
      label: trim.label,
      doors: trim.doors,
      seats: trim.seats,
      engineDisplacementCc: trim.engineDisplacementCc,
      isAutomatic: trim.isAutomatic,
      fuelType: trim.fuelType,
      model: trim.model,
    });

    this.modelsSharedCollection = this.modelService.addModelToCollectionIfMissing(this.modelsSharedCollection, trim.model);
  }

  protected loadRelationshipsOptions(): void {
    this.modelService
      .query()
      .pipe(map((res: HttpResponse<IModel[]>) => res.body ?? []))
      .pipe(map((models: IModel[]) => this.modelService.addModelToCollectionIfMissing(models, this.editForm.get('model')!.value)))
      .subscribe((models: IModel[]) => (this.modelsSharedCollection = models));
  }

  protected createFromForm(): ITrim {
    return {
      ...new Trim(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
      doors: this.editForm.get(['doors'])!.value,
      seats: this.editForm.get(['seats'])!.value,
      engineDisplacementCc: this.editForm.get(['engineDisplacementCc'])!.value,
      isAutomatic: this.editForm.get(['isAutomatic'])!.value,
      fuelType: this.editForm.get(['fuelType'])!.value,
      model: this.editForm.get(['model'])!.value,
    };
  }
}
