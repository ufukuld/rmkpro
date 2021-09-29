import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVehicleImages } from '../vehicle-images.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-vehicle-images-detail',
  templateUrl: './vehicle-images-detail.component.html',
})
export class VehicleImagesDetailComponent implements OnInit {
  vehicleImages: IVehicleImages | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleImages }) => {
      this.vehicleImages = vehicleImages;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
