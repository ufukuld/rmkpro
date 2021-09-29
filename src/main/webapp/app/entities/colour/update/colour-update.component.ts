import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IColour, Colour } from '../colour.model';
import { ColourService } from '../service/colour.service';

@Component({
  selector: 'jhi-colour-update',
  templateUrl: './colour-update.component.html',
})
export class ColourUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required]],
    paintType: [null, [Validators.required]],
  });

  constructor(protected colourService: ColourService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ colour }) => {
      this.updateForm(colour);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const colour = this.createFromForm();
    if (colour.id !== undefined) {
      this.subscribeToSaveResponse(this.colourService.update(colour));
    } else {
      this.subscribeToSaveResponse(this.colourService.create(colour));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IColour>>): void {
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

  protected updateForm(colour: IColour): void {
    this.editForm.patchValue({
      id: colour.id,
      label: colour.label,
      paintType: colour.paintType,
    });
  }

  protected createFromForm(): IColour {
    return {
      ...new Colour(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
      paintType: this.editForm.get(['paintType'])!.value,
    };
  }
}
