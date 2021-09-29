import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CostsComponent } from '../list/costs.component';
import { CostsDetailComponent } from '../detail/costs-detail.component';
import { CostsUpdateComponent } from '../update/costs-update.component';
import { CostsRoutingResolveService } from './costs-routing-resolve.service';

const costsRoute: Routes = [
  {
    path: '',
    component: CostsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CostsDetailComponent,
    resolve: {
      costs: CostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CostsUpdateComponent,
    resolve: {
      costs: CostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CostsUpdateComponent,
    resolve: {
      costs: CostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(costsRoute)],
  exports: [RouterModule],
})
export class CostsRoutingModule {}
