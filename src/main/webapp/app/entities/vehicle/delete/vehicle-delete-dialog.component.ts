import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';

@Component({
  templateUrl: './vehicle-delete-dialog.component.html',
})
export class VehicleDeleteDialogComponent {
  vehicle?: IVehicle;

  constructor(protected vehicleService: VehicleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
