import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';
import { VehicleDeleteDialogComponent } from '../delete/vehicle-delete-dialog.component';

@Component({
  selector: 'jhi-vehicle',
  templateUrl: './vehicle.component.html',
})
export class VehicleComponent implements OnInit {
  vehicles?: IVehicle[];
  isLoading = false;

  constructor(protected vehicleService: VehicleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.vehicleService.query().subscribe(
      (res: HttpResponse<IVehicle[]>) => {
        this.isLoading = false;
        this.vehicles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVehicle): number {
    return item.id!;
  }

  delete(vehicle: IVehicle): void {
    const modalRef = this.modalService.open(VehicleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vehicle = vehicle;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
