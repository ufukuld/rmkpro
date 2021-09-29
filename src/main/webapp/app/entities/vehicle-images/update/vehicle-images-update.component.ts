import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVehicleImages, VehicleImages } from '../vehicle-images.model';
import { VehicleImagesService } from '../service/vehicle-images.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';

@Component({
  selector: 'jhi-vehicle-images-update',
  templateUrl: './vehicle-images-update.component.html',
})
export class VehicleImagesUpdateComponent implements OnInit {
  isSaving = false;

  vehiclesSharedCollection: IVehicle[] = [];

  editForm = this.fb.group({
    id: [],
    contentType: [null, [Validators.required]],
    image: [null, [Validators.required]],
    imageContentType: [],
    vehicle: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected vehicleImagesService: VehicleImagesService,
    protected vehicleService: VehicleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleImages }) => {
      this.updateForm(vehicleImages);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('rmkproApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicleImages = this.createFromForm();
    if (vehicleImages.id !== undefined) {
      this.subscribeToSaveResponse(this.vehicleImagesService.update(vehicleImages));
    } else {
      this.subscribeToSaveResponse(this.vehicleImagesService.create(vehicleImages));
    }
  }

  trackVehicleById(index: number, item: IVehicle): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicleImages>>): void {
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

  protected updateForm(vehicleImages: IVehicleImages): void {
    this.editForm.patchValue({
      id: vehicleImages.id,
      contentType: vehicleImages.contentType,
      image: vehicleImages.image,
      imageContentType: vehicleImages.imageContentType,
      vehicle: vehicleImages.vehicle,
    });

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing(
      this.vehiclesSharedCollection,
      vehicleImages.vehicle
    );
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

  protected createFromForm(): IVehicleImages {
    return {
      ...new VehicleImages(),
      id: this.editForm.get(['id'])!.value,
      contentType: this.editForm.get(['contentType'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      vehicle: this.editForm.get(['vehicle'])!.value,
    };
  }
}
