import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrimComponent } from './list/trim.component';
import { TrimDetailComponent } from './detail/trim-detail.component';
import { TrimUpdateComponent } from './update/trim-update.component';
import { TrimDeleteDialogComponent } from './delete/trim-delete-dialog.component';
import { TrimRoutingModule } from './route/trim-routing.module';

@NgModule({
  imports: [SharedModule, TrimRoutingModule],
  declarations: [TrimComponent, TrimDetailComponent, TrimUpdateComponent, TrimDeleteDialogComponent],
  entryComponents: [TrimDeleteDialogComponent],
})
export class TrimModule {}
