import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IColour } from '../colour.model';
import { ColourService } from '../service/colour.service';
import { ColourDeleteDialogComponent } from '../delete/colour-delete-dialog.component';

@Component({
  selector: 'jhi-colour',
  templateUrl: './colour.component.html',
})
export class ColourComponent implements OnInit {
  colours?: IColour[];
  isLoading = false;

  constructor(protected colourService: ColourService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.colourService.query().subscribe(
      (res: HttpResponse<IColour[]>) => {
        this.isLoading = false;
        this.colours = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IColour): number {
    return item.id!;
  }

  delete(colour: IColour): void {
    const modalRef = this.modalService.open(ColourDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.colour = colour;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
