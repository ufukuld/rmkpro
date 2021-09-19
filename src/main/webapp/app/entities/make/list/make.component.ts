import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMake } from '../make.model';
import { MakeService } from '../service/make.service';
import { MakeDeleteDialogComponent } from '../delete/make-delete-dialog.component';

@Component({
  selector: 'jhi-make',
  templateUrl: './make.component.html',
})
export class MakeComponent implements OnInit {
  makes?: IMake[];
  isLoading = false;

  constructor(protected makeService: MakeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.makeService.query().subscribe(
      (res: HttpResponse<IMake[]>) => {
        this.isLoading = false;
        this.makes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMake): number {
    return item.id!;
  }

  delete(make: IMake): void {
    const modalRef = this.modalService.open(MakeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.make = make;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
