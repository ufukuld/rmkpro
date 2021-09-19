import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMake, Make } from '../make.model';
import { MakeService } from '../service/make.service';

@Component({
  selector: 'jhi-make-update',
  templateUrl: './make-update.component.html',
})
export class MakeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required]],
  });

  constructor(protected makeService: MakeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ make }) => {
      this.updateForm(make);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const make = this.createFromForm();
    if (make.id !== undefined) {
      this.subscribeToSaveResponse(this.makeService.update(make));
    } else {
      this.subscribeToSaveResponse(this.makeService.create(make));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMake>>): void {
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

  protected updateForm(make: IMake): void {
    this.editForm.patchValue({
      id: make.id,
      label: make.label,
    });
  }

  protected createFromForm(): IMake {
    return {
      ...new Make(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
