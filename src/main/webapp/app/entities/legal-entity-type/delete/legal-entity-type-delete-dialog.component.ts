import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalEntityType } from '../legal-entity-type.model';
import { LegalEntityTypeService } from '../service/legal-entity-type.service';

@Component({
  templateUrl: './legal-entity-type-delete-dialog.component.html',
})
export class LegalEntityTypeDeleteDialogComponent {
  legalEntityType?: ILegalEntityType;

  constructor(protected legalEntityTypeService: LegalEntityTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.legalEntityTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
