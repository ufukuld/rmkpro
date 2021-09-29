import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VehicleImagesComponent } from './list/vehicle-images.component';
import { VehicleImagesDetailComponent } from './detail/vehicle-images-detail.component';
import { VehicleImagesUpdateComponent } from './update/vehicle-images-update.component';
import { VehicleImagesDeleteDialogComponent } from './delete/vehicle-images-delete-dialog.component';
import { VehicleImagesRoutingModule } from './route/vehicle-images-routing.module';

@NgModule({
  imports: [SharedModule, VehicleImagesRoutingModule],
  declarations: [VehicleImagesComponent, VehicleImagesDetailComponent, VehicleImagesUpdateComponent, VehicleImagesDeleteDialogComponent],
  entryComponents: [VehicleImagesDeleteDialogComponent],
})
export class VehicleImagesModule {}
