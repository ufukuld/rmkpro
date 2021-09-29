import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ColourComponent } from './list/colour.component';
import { ColourDetailComponent } from './detail/colour-detail.component';
import { ColourUpdateComponent } from './update/colour-update.component';
import { ColourDeleteDialogComponent } from './delete/colour-delete-dialog.component';
import { ColourRoutingModule } from './route/colour-routing.module';

@NgModule({
  imports: [SharedModule, ColourRoutingModule],
  declarations: [ColourComponent, ColourDetailComponent, ColourUpdateComponent, ColourDeleteDialogComponent],
  entryComponents: [ColourDeleteDialogComponent],
})
export class ColourModule {}
