import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrim } from '../trim.model';

@Component({
  selector: 'jhi-trim-detail',
  templateUrl: './trim-detail.component.html',
})
export class TrimDetailComponent implements OnInit {
  trim: ITrim | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trim }) => {
      this.trim = trim;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
