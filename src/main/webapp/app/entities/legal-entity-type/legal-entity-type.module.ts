import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LegalEntityTypeComponent } from './list/legal-entity-type.component';
import { LegalEntityTypeDetailComponent } from './detail/legal-entity-type-detail.component';
import { LegalEntityTypeUpdateComponent } from './update/legal-entity-type-update.component';
import { LegalEntityTypeDeleteDialogComponent } from './delete/legal-entity-type-delete-dialog.component';
import { LegalEntityTypeRoutingModule } from './route/legal-entity-type-routing.module';

@NgModule({
  imports: [SharedModule, LegalEntityTypeRoutingModule],
  declarations: [
    LegalEntityTypeComponent,
    LegalEntityTypeDetailComponent,
    LegalEntityTypeUpdateComponent,
    LegalEntityTypeDeleteDialogComponent,
  ],
  entryComponents: [LegalEntityTypeDeleteDialogComponent],
})
export class LegalEntityTypeModule {}
