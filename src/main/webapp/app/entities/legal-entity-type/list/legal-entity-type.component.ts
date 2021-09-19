import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalEntityType } from '../legal-entity-type.model';
import { LegalEntityTypeService } from '../service/legal-entity-type.service';
import { LegalEntityTypeDeleteDialogComponent } from '../delete/legal-entity-type-delete-dialog.component';

@Component({
  selector: 'jhi-legal-entity-type',
  templateUrl: './legal-entity-type.component.html',
})
export class LegalEntityTypeComponent implements OnInit {
  legalEntityTypes?: ILegalEntityType[];
  isLoading = false;

  constructor(protected legalEntityTypeService: LegalEntityTypeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.legalEntityTypeService.query().subscribe(
      (res: HttpResponse<ILegalEntityType[]>) => {
        this.isLoading = false;
        this.legalEntityTypes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILegalEntityType): number {
    return item.id!;
  }

  delete(legalEntityType: ILegalEntityType): void {
    const modalRef = this.modalService.open(LegalEntityTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.legalEntityType = legalEntityType;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
