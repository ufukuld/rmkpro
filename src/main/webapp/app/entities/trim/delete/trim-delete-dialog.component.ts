import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrim } from '../trim.model';
import { TrimService } from '../service/trim.service';

@Component({
  templateUrl: './trim-delete-dialog.component.html',
})
export class TrimDeleteDialogComponent {
  trim?: ITrim;

  constructor(protected trimService: TrimService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trimService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
