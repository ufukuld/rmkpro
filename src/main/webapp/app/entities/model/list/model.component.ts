import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IModel } from '../model.model';
import { ModelService } from '../service/model.service';
import { ModelDeleteDialogComponent } from '../delete/model-delete-dialog.component';

@Component({
  selector: 'jhi-model',
  templateUrl: './model.component.html',
})
export class ModelComponent implements OnInit {
  models?: IModel[];
  isLoading = false;

  constructor(protected modelService: ModelService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.modelService.query().subscribe(
      (res: HttpResponse<IModel[]>) => {
        this.isLoading = false;
        this.models = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IModel): number {
    return item.id!;
  }

  delete(model: IModel): void {
    const modalRef = this.modalService.open(ModelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.model = model;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
