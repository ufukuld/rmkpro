import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'legal-entity',
        data: { pageTitle: 'rmkproApp.legalEntity.home.title' },
        loadChildren: () => import('./legal-entity/legal-entity.module').then(m => m.LegalEntityModule),
      },
      {
        path: 'model',
        data: { pageTitle: 'rmkproApp.model.home.title' },
        loadChildren: () => import('./model/model.module').then(m => m.ModelModule),
      },
      {
        path: 'make',
        data: { pageTitle: 'rmkproApp.make.home.title' },
        loadChildren: () => import('./make/make.module').then(m => m.MakeModule),
      },
      {
        path: 'vehicle',
        data: { pageTitle: 'rmkproApp.vehicle.home.title' },
        loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule),
      },
      {
        path: 'legal-entity-type',
        data: { pageTitle: 'rmkproApp.legalEntityType.home.title' },
        loadChildren: () => import('./legal-entity-type/legal-entity-type.module').then(m => m.LegalEntityTypeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
