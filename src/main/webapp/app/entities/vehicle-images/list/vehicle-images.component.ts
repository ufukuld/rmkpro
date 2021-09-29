import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicleImages } from '../vehicle-images.model';
import { VehicleImagesService } from '../service/vehicle-images.service';
import { VehicleImagesDeleteDialogComponent } from '../delete/vehicle-images-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-vehicle-images',
  templateUrl: './vehicle-images.component.html',
})
export class VehicleImagesComponent implements OnInit {
  vehicleImages?: IVehicleImages[];
  isLoading = false;

  constructor(protected vehicleImagesService: VehicleImagesService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.vehicleImagesService.query().subscribe(
      (res: HttpResponse<IVehicleImages[]>) => {
        this.isLoading = false;
        this.vehicleImages = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVehicleImages): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(vehicleImages: IVehicleImages): void {
    const modalRef = this.modalService.open(VehicleImagesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vehicleImages = vehicleImages;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
