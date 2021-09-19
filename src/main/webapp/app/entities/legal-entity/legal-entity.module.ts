import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LegalEntityComponent } from './list/legal-entity.component';
import { LegalEntityDetailComponent } from './detail/legal-entity-detail.component';
import { LegalEntityUpdateComponent } from './update/legal-entity-update.component';
import { LegalEntityDeleteDialogComponent } from './delete/legal-entity-delete-dialog.component';
import { LegalEntityRoutingModule } from './route/legal-entity-routing.module';

@NgModule({
  imports: [SharedModule, LegalEntityRoutingModule],
  declarations: [LegalEntityComponent, LegalEntityDetailComponent, LegalEntityUpdateComponent, LegalEntityDeleteDialogComponent],
  entryComponents: [LegalEntityDeleteDialogComponent],
})
export class LegalEntityModule {}
