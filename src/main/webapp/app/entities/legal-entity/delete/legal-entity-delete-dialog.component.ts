import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalEntity } from '../legal-entity.model';
import { LegalEntityService } from '../service/legal-entity.service';

@Component({
  templateUrl: './legal-entity-delete-dialog.component.html',
})
export class LegalEntityDeleteDialogComponent {
  legalEntity?: ILegalEntity;

  constructor(protected legalEntityService: LegalEntityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.legalEntityService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
