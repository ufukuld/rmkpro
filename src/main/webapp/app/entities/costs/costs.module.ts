import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CostsComponent } from './list/costs.component';
import { CostsDetailComponent } from './detail/costs-detail.component';
import { CostsUpdateComponent } from './update/costs-update.component';
import { CostsDeleteDialogComponent } from './delete/costs-delete-dialog.component';
import { CostsRoutingModule } from './route/costs-routing.module';

@NgModule({
  imports: [SharedModule, CostsRoutingModule],
  declarations: [CostsComponent, CostsDetailComponent, CostsUpdateComponent, CostsDeleteDialogComponent],
  entryComponents: [CostsDeleteDialogComponent],
})
export class CostsModule {}
