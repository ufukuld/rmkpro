import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VehicleComponent } from './list/vehicle.component';
import { VehicleDetailComponent } from './detail/vehicle-detail.component';
import { VehicleUpdateComponent } from './update/vehicle-update.component';
import { VehicleDeleteDialogComponent } from './delete/vehicle-delete-dialog.component';
import { VehicleRoutingModule } from './route/vehicle-routing.module';

@NgModule({
  imports: [SharedModule, VehicleRoutingModule],
  declarations: [VehicleComponent, VehicleDetailComponent, VehicleUpdateComponent, VehicleDeleteDialogComponent],
  entryComponents: [VehicleDeleteDialogComponent],
})
export class VehicleModule {}
