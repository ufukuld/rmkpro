import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LegalEntityComponent } from '../list/legal-entity.component';
import { LegalEntityDetailComponent } from '../detail/legal-entity-detail.component';
import { LegalEntityUpdateComponent } from '../update/legal-entity-update.component';
import { LegalEntityRoutingResolveService } from './legal-entity-routing-resolve.service';

const legalEntityRoute: Routes = [
  {
    path: '',
    component: LegalEntityComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LegalEntityDetailComponent,
    resolve: {
      legalEntity: LegalEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LegalEntityUpdateComponent,
    resolve: {
      legalEntity: LegalEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LegalEntityUpdateComponent,
    resolve: {
      legalEntity: LegalEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(legalEntityRoute)],
  exports: [RouterModule],
})
export class LegalEntityRoutingModule {}
