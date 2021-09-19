import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMake } from '../make.model';

@Component({
  selector: 'jhi-make-detail',
  templateUrl: './make-detail.component.html',
})
export class MakeDetailComponent implements OnInit {
  make: IMake | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ make }) => {
      this.make = make;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
