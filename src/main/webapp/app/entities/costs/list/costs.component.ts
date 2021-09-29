import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICosts } from '../costs.model';
import { CostsService } from '../service/costs.service';
import { CostsDeleteDialogComponent } from '../delete/costs-delete-dialog.component';

@Component({
  selector: 'jhi-costs',
  templateUrl: './costs.component.html',
})
export class CostsComponent implements OnInit {
  costs?: ICosts[];
  isLoading = false;

  constructor(protected costsService: CostsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.costsService.query().subscribe(
      (res: HttpResponse<ICosts[]>) => {
        this.isLoading = false;
        this.costs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICosts): number {
    return item.id!;
  }

  delete(costs: ICosts): void {
    const modalRef = this.modalService.open(CostsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.costs = costs;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
