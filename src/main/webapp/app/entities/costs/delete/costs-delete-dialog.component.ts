import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICosts } from '../costs.model';
import { CostsService } from '../service/costs.service';

@Component({
  templateUrl: './costs-delete-dialog.component.html',
})
export class CostsDeleteDialogComponent {
  costs?: ICosts;

  constructor(protected costsService: CostsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.costsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
