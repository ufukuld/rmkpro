import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicleImages } from '../vehicle-images.model';
import { VehicleImagesService } from '../service/vehicle-images.service';

@Component({
  templateUrl: './vehicle-images-delete-dialog.component.html',
})
export class VehicleImagesDeleteDialogComponent {
  vehicleImages?: IVehicleImages;

  constructor(protected vehicleImagesService: VehicleImagesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleImagesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
