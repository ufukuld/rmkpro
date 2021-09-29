import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICosts, Costs } from '../costs.model';
import { CostsService } from '../service/costs.service';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';

@Component({
  selector: 'jhi-costs-update',
  templateUrl: './costs-update.component.html',
})
export class CostsUpdateComponent implements OnInit {
  isSaving = false;

  vehiclesSharedCollection: IVehicle[] = [];

  editForm = this.fb.group({
    id: [],
    detail: [null, [Validators.required]],
    unitPrice: [],
    vatAmount: [],
    vatPercentage: [],
    netAmount: [],
    vehicle: [],
  });

  constructor(
    protected costsService: CostsService,
    protected vehicleService: VehicleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ costs }) => {
      this.updateForm(costs);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const costs = this.createFromForm();
    if (costs.id !== undefined) {
      this.subscribeToSaveResponse(this.costsService.update(costs));
    } else {
      this.subscribeToSaveResponse(this.costsService.create(costs));
    }
  }

  trackVehicleById(index: number, item: IVehicle): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICosts>>): void {
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

  protected updateForm(costs: ICosts): void {
    this.editForm.patchValue({
      id: costs.id,
      detail: costs.detail,
      unitPrice: costs.unitPrice,
      vatAmount: costs.vatAmount,
      vatPercentage: costs.vatPercentage,
      netAmount: costs.netAmount,
      vehicle: costs.vehicle,
    });

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing(this.vehiclesSharedCollection, costs.vehicle);
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleService
      .query()
      .pipe(map((res: HttpResponse<IVehicle[]>) => res.body ?? []))
      .pipe(
        map((vehicles: IVehicle[]) => this.vehicleService.addVehicleToCollectionIfMissing(vehicles, this.editForm.get('vehicle')!.value))
      )
      .subscribe((vehicles: IVehicle[]) => (this.vehiclesSharedCollection = vehicles));
  }

  protected createFromForm(): ICosts {
    return {
      ...new Costs(),
      id: this.editForm.get(['id'])!.value,
      detail: this.editForm.get(['detail'])!.value,
      unitPrice: this.editForm.get(['unitPrice'])!.value,
      vatAmount: this.editForm.get(['vatAmount'])!.value,
      vatPercentage: this.editForm.get(['vatPercentage'])!.value,
      netAmount: this.editForm.get(['netAmount'])!.value,
      vehicle: this.editForm.get(['vehicle'])!.value,
    };
  }
}
