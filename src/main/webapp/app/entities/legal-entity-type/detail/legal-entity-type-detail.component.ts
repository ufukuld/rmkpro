import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILegalEntityType } from '../legal-entity-type.model';

@Component({
  selector: 'jhi-legal-entity-type-detail',
  templateUrl: './legal-entity-type-detail.component.html',
})
export class LegalEntityTypeDetailComponent implements OnInit {
  legalEntityType: ILegalEntityType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalEntityType }) => {
      this.legalEntityType = legalEntityType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
