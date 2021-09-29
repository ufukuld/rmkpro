import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVehicle, Vehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';
import { ITrim } from 'app/entities/trim/trim.model';
import { TrimService } from 'app/entities/trim/service/trim.service';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { LegalEntityService } from 'app/entities/legal-entity/service/legal-entity.service';
import { IColour } from 'app/entities/colour/colour.model';
import { ColourService } from 'app/entities/colour/service/colour.service';

@Component({
  selector: 'jhi-vehicle-update',
  templateUrl: './vehicle-update.component.html',
})
export class VehicleUpdateComponent implements OnInit {
  isSaving = false;

  trimsSharedCollection: ITrim[] = [];
  legalEntitiesSharedCollection: ILegalEntity[] = [];
  coloursSharedCollection: IColour[] = [];

  editForm = this.fb.group({
    id: [],
    registrationNumber: [null, [Validators.required]],
    firstRegistrationDate: [null, [Validators.required]],
    status: [],
    mileage: [null, [Validators.required]],
    reservePrice: [],
    proposedSalePrice: [],
    netBookValue: [],
    trim: [],
    owner: [],
    colour: [],
  });

  constructor(
    protected vehicleService: VehicleService,
    protected trimService: TrimService,
    protected legalEntityService: LegalEntityService,
    protected colourService: ColourService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicle }) => {
      this.updateForm(vehicle);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicle = this.createFromForm();
    if (vehicle.id !== undefined) {
      this.subscribeToSaveResponse(this.vehicleService.update(vehicle));
    } else {
      this.subscribeToSaveResponse(this.vehicleService.create(vehicle));
    }
  }

  trackTrimById(index: number, item: ITrim): number {
    return item.id!;
  }

  trackLegalEntityById(index: number, item: ILegalEntity): number {
    return item.id!;
  }

  trackColourById(index: number, item: IColour): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicle>>): void {
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

  protected updateForm(vehicle: IVehicle): void {
    this.editForm.patchValue({
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      firstRegistrationDate: vehicle.firstRegistrationDate,
      status: vehicle.status,
      mileage: vehicle.mileage,
      reservePrice: vehicle.reservePrice,
      proposedSalePrice: vehicle.proposedSalePrice,
      netBookValue: vehicle.netBookValue,
      trim: vehicle.trim,
      owner: vehicle.owner,
      colour: vehicle.colour,
    });

    this.trimsSharedCollection = this.trimService.addTrimToCollectionIfMissing(this.trimsSharedCollection, vehicle.trim);
    this.legalEntitiesSharedCollection = this.legalEntityService.addLegalEntityToCollectionIfMissing(
      this.legalEntitiesSharedCollection,
      vehicle.owner
    );
    this.coloursSharedCollection = this.colourService.addColourToCollectionIfMissing(this.coloursSharedCollection, vehicle.colour);
  }

  protected loadRelationshipsOptions(): void {
    this.trimService
      .query()
      .pipe(map((res: HttpResponse<ITrim[]>) => res.body ?? []))
      .pipe(map((trims: ITrim[]) => this.trimService.addTrimToCollectionIfMissing(trims, this.editForm.get('trim')!.value)))
      .subscribe((trims: ITrim[]) => (this.trimsSharedCollection = trims));

    this.legalEntityService
      .query()
      .pipe(map((res: HttpResponse<ILegalEntity[]>) => res.body ?? []))
      .pipe(
        map((legalEntities: ILegalEntity[]) =>
          this.legalEntityService.addLegalEntityToCollectionIfMissing(legalEntities, this.editForm.get('owner')!.value)
        )
      )
      .subscribe((legalEntities: ILegalEntity[]) => (this.legalEntitiesSharedCollection = legalEntities));

    this.colourService
      .query()
      .pipe(map((res: HttpResponse<IColour[]>) => res.body ?? []))
      .pipe(map((colours: IColour[]) => this.colourService.addColourToCollectionIfMissing(colours, this.editForm.get('colour')!.value)))
      .subscribe((colours: IColour[]) => (this.coloursSharedCollection = colours));
  }

  protected createFromForm(): IVehicle {
    return {
      ...new Vehicle(),
      id: this.editForm.get(['id'])!.value,
      registrationNumber: this.editForm.get(['registrationNumber'])!.value,
      firstRegistrationDate: this.editForm.get(['firstRegistrationDate'])!.value,
      status: this.editForm.get(['status'])!.value,
      mileage: this.editForm.get(['mileage'])!.value,
      reservePrice: this.editForm.get(['reservePrice'])!.value,
      proposedSalePrice: this.editForm.get(['proposedSalePrice'])!.value,
      netBookValue: this.editForm.get(['netBookValue'])!.value,
      trim: this.editForm.get(['trim'])!.value,
      owner: this.editForm.get(['owner'])!.value,
      colour: this.editForm.get(['colour'])!.value,
    };
  }
}
