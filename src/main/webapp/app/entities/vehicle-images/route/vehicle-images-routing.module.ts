import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VehicleImagesComponent } from '../list/vehicle-images.component';
import { VehicleImagesDetailComponent } from '../detail/vehicle-images-detail.component';
import { VehicleImagesUpdateComponent } from '../update/vehicle-images-update.component';
import { VehicleImagesRoutingResolveService } from './vehicle-images-routing-resolve.service';

const vehicleImagesRoute: Routes = [
  {
    path: '',
    component: VehicleImagesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VehicleImagesDetailComponent,
    resolve: {
      vehicleImages: VehicleImagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VehicleImagesUpdateComponent,
    resolve: {
      vehicleImages: VehicleImagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VehicleImagesUpdateComponent,
    resolve: {
      vehicleImages: VehicleImagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vehicleImagesRoute)],
  exports: [RouterModule],
})
export class VehicleImagesRoutingModule {}
