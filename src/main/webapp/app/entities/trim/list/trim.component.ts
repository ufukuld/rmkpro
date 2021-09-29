import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrim } from '../trim.model';
import { TrimService } from '../service/trim.service';
import { TrimDeleteDialogComponent } from '../delete/trim-delete-dialog.component';

@Component({
  selector: 'jhi-trim',
  templateUrl: './trim.component.html',
})
export class TrimComponent implements OnInit {
  trims?: ITrim[];
  isLoading = false;

  constructor(protected trimService: TrimService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.trimService.query().subscribe(
      (res: HttpResponse<ITrim[]>) => {
        this.isLoading = false;
        this.trims = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITrim): number {
    return item.id!;
  }

  delete(trim: ITrim): void {
    const modalRef = this.modalService.open(TrimDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.trim = trim;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
