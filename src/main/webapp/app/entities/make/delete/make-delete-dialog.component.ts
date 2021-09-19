import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMake } from '../make.model';
import { MakeService } from '../service/make.service';

@Component({
  templateUrl: './make-delete-dialog.component.html',
})
export class MakeDeleteDialogComponent {
  make?: IMake;

  constructor(protected makeService: MakeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.makeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
