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
      {
        path: 'person',
        data: { pageTitle: 'rmkproApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'company',
        data: { pageTitle: 'rmkproApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'colour',
        data: { pageTitle: 'rmkproApp.colour.home.title' },
        loadChildren: () => import('./colour/colour.module').then(m => m.ColourModule),
      },
      {
        path: 'trim',
        data: { pageTitle: 'rmkproApp.trim.home.title' },
        loadChildren: () => import('./trim/trim.module').then(m => m.TrimModule),
      },
      {
        path: 'costs',
        data: { pageTitle: 'rmkproApp.costs.home.title' },
        loadChildren: () => import('./costs/costs.module').then(m => m.CostsModule),
      },
      {
        path: 'vehicle-images',
        data: { pageTitle: 'rmkproApp.vehicleImages.home.title' },
        loadChildren: () => import('./vehicle-images/vehicle-images.module').then(m => m.VehicleImagesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
