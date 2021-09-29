import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICosts } from '../costs.model';

@Component({
  selector: 'jhi-costs-detail',
  templateUrl: './costs-detail.component.html',
})
export class CostsDetailComponent implements OnInit {
  costs: ICosts | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ costs }) => {
      this.costs = costs;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
