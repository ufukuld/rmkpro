import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ColourComponent } from '../list/colour.component';
import { ColourDetailComponent } from '../detail/colour-detail.component';
import { ColourUpdateComponent } from '../update/colour-update.component';
import { ColourRoutingResolveService } from './colour-routing-resolve.service';

const colourRoute: Routes = [
  {
    path: '',
    component: ColourComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ColourDetailComponent,
    resolve: {
      colour: ColourRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ColourUpdateComponent,
    resolve: {
      colour: ColourRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ColourUpdateComponent,
    resolve: {
      colour: ColourRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(colourRoute)],
  exports: [RouterModule],
})
export class ColourRoutingModule {}
