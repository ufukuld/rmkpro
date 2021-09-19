import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILegalEntity } from '../legal-entity.model';

@Component({
  selector: 'jhi-legal-entity-detail',
  templateUrl: './legal-entity-detail.component.html',
})
export class LegalEntityDetailComponent implements OnInit {
  legalEntity: ILegalEntity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalEntity }) => {
      this.legalEntity = legalEntity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
