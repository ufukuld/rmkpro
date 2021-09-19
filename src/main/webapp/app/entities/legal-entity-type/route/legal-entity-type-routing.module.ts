import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LegalEntityTypeComponent } from '../list/legal-entity-type.component';
import { LegalEntityTypeDetailComponent } from '../detail/legal-entity-type-detail.component';
import { LegalEntityTypeUpdateComponent } from '../update/legal-entity-type-update.component';
import { LegalEntityTypeRoutingResolveService } from './legal-entity-type-routing-resolve.service';

const legalEntityTypeRoute: Routes = [
  {
    path: '',
    component: LegalEntityTypeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LegalEntityTypeDetailComponent,
    resolve: {
      legalEntityType: LegalEntityTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LegalEntityTypeUpdateComponent,
    resolve: {
      legalEntityType: LegalEntityTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LegalEntityTypeUpdateComponent,
    resolve: {
      legalEntityType: LegalEntityTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(legalEntityTypeRoute)],
  exports: [RouterModule],
})
export class LegalEntityTypeRoutingModule {}
