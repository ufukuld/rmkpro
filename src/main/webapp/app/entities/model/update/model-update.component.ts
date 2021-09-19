import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IModel, Model } from '../model.model';
import { ModelService } from '../service/model.service';
import { IMake } from 'app/entities/make/make.model';
import { MakeService } from 'app/entities/make/service/make.service';

@Component({
  selector: 'jhi-model-update',
  templateUrl: './model-update.component.html',
})
export class ModelUpdateComponent implements OnInit {
  isSaving = false;

  makesSharedCollection: IMake[] = [];

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required]],
    make: [],
  });

  constructor(
    protected modelService: ModelService,
    protected makeService: MakeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ model }) => {
      this.updateForm(model);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const model = this.createFromForm();
    if (model.id !== undefined) {
      this.subscribeToSaveResponse(this.modelService.update(model));
    } else {
      this.subscribeToSaveResponse(this.modelService.create(model));
    }
  }

  trackMakeById(index: number, item: IMake): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModel>>): void {
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

  protected updateForm(model: IModel): void {
    this.editForm.patchValue({
      id: model.id,
      label: model.label,
      make: model.make,
    });

    this.makesSharedCollection = this.makeService.addMakeToCollectionIfMissing(this.makesSharedCollection, model.make);
  }

  protected loadRelationshipsOptions(): void {
    this.makeService
      .query()
      .pipe(map((res: HttpResponse<IMake[]>) => res.body ?? []))
      .pipe(map((makes: IMake[]) => this.makeService.addMakeToCollectionIfMissing(makes, this.editForm.get('make')!.value)))
      .subscribe((makes: IMake[]) => (this.makesSharedCollection = makes));
  }

  protected createFromForm(): IModel {
    return {
      ...new Model(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
      make: this.editForm.get(['make'])!.value,
    };
  }
}
