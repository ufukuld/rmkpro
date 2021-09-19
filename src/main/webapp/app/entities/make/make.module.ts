import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MakeComponent } from './list/make.component';
import { MakeDetailComponent } from './detail/make-detail.component';
import { MakeUpdateComponent } from './update/make-update.component';
import { MakeDeleteDialogComponent } from './delete/make-delete-dialog.component';
import { MakeRoutingModule } from './route/make-routing.module';

@NgModule({
  imports: [SharedModule, MakeRoutingModule],
  declarations: [MakeComponent, MakeDetailComponent, MakeUpdateComponent, MakeDeleteDialogComponent],
  entryComponents: [MakeDeleteDialogComponent],
})
export class MakeModule {}
