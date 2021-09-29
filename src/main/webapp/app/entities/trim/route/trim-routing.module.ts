import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrimComponent } from '../list/trim.component';
import { TrimDetailComponent } from '../detail/trim-detail.component';
import { TrimUpdateComponent } from '../update/trim-update.component';
import { TrimRoutingResolveService } from './trim-routing-resolve.service';

const trimRoute: Routes = [
  {
    path: '',
    component: TrimComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrimDetailComponent,
    resolve: {
      trim: TrimRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrimUpdateComponent,
    resolve: {
      trim: TrimRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrimUpdateComponent,
    resolve: {
      trim: TrimRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trimRoute)],
  exports: [RouterModule],
})
export class TrimRoutingModule {}
