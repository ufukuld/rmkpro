import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MakeComponent } from '../list/make.component';
import { MakeDetailComponent } from '../detail/make-detail.component';
import { MakeUpdateComponent } from '../update/make-update.component';
import { MakeRoutingResolveService } from './make-routing-resolve.service';

const makeRoute: Routes = [
  {
    path: '',
    component: MakeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MakeDetailComponent,
    resolve: {
      make: MakeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MakeUpdateComponent,
    resolve: {
      make: MakeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MakeUpdateComponent,
    resolve: {
      make: MakeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(makeRoute)],
  exports: [RouterModule],
})
export class MakeRoutingModule {}
