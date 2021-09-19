import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalEntity } from '../legal-entity.model';
import { LegalEntityService } from '../service/legal-entity.service';
import { LegalEntityDeleteDialogComponent } from '../delete/legal-entity-delete-dialog.component';

@Component({
  selector: 'jhi-legal-entity',
  templateUrl: './legal-entity.component.html',
})
export class LegalEntityComponent implements OnInit {
  legalEntities?: ILegalEntity[];
  isLoading = false;

  constructor(protected legalEntityService: LegalEntityService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.legalEntityService.query().subscribe(
      (res: HttpResponse<ILegalEntity[]>) => {
        this.isLoading = false;
        this.legalEntities = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILegalEntity): number {
    return item.id!;
  }

  delete(legalEntity: ILegalEntity): void {
    const modalRef = this.modalService.open(LegalEntityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.legalEntity = legalEntity;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
