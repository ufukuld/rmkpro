import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVehicle, Vehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';
import { IMake } from 'app/entities/make/make.model';
import { MakeService } from 'app/entities/make/service/make.service';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { LegalEntityService } from 'app/entities/legal-entity/service/legal-entity.service';

@Component({
  selector: 'jhi-vehicle-update',
  templateUrl: './vehicle-update.component.html',
})
export class VehicleUpdateComponent implements OnInit {
  isSaving = false;

  makesSharedCollection: IMake[] = [];
  legalEntitiesSharedCollection: ILegalEntity[] = [];

  editForm = this.fb.group({
    id: [],
    registrationNumber: [null, [Validators.required]],
    firstRegistrationDate: [null, [Validators.required]],
    make: [],
    owner: [],
  });

  constructor(
    protected vehicleService: VehicleService,
    protected makeService: MakeService,
    protected legalEntityService: LegalEntityService,
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

  trackMakeById(index: number, item: IMake): number {
    return item.id!;
  }

  trackLegalEntityById(index: number, item: ILegalEntity): number {
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
      make: vehicle.make,
      owner: vehicle.owner,
    });

    this.makesSharedCollection = this.makeService.addMakeToCollectionIfMissing(this.makesSharedCollection, vehicle.make);
    this.legalEntitiesSharedCollection = this.legalEntityService.addLegalEntityToCollectionIfMissing(
      this.legalEntitiesSharedCollection,
      vehicle.owner
    );
  }

  protected loadRelationshipsOptions(): void {
    this.makeService
      .query()
      .pipe(map((res: HttpResponse<IMake[]>) => res.body ?? []))
      .pipe(map((makes: IMake[]) => this.makeService.addMakeToCollectionIfMissing(makes, this.editForm.get('make')!.value)))
      .subscribe((makes: IMake[]) => (this.makesSharedCollection = makes));

    this.legalEntityService
      .query()
      .pipe(map((res: HttpResponse<ILegalEntity[]>) => res.body ?? []))
      .pipe(
        map((legalEntities: ILegalEntity[]) =>
          this.legalEntityService.addLegalEntityToCollectionIfMissing(legalEntities, this.editForm.get('owner')!.value)
        )
      )
      .subscribe((legalEntities: ILegalEntity[]) => (this.legalEntitiesSharedCollection = legalEntities));
  }

  protected createFromForm(): IVehicle {
    return {
      ...new Vehicle(),
      id: this.editForm.get(['id'])!.value,
      registrationNumber: this.editForm.get(['registrationNumber'])!.value,
      firstRegistrationDate: this.editForm.get(['firstRegistrationDate'])!.value,
      make: this.editForm.get(['make'])!.value,
      owner: this.editForm.get(['owner'])!.value,
    };
  }
}
