import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IColour } from '../colour.model';
import { ColourService } from '../service/colour.service';

@Component({
  templateUrl: './colour-delete-dialog.component.html',
})
export class ColourDeleteDialogComponent {
  colour?: IColour;

  constructor(protected colourService: ColourService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.colourService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
