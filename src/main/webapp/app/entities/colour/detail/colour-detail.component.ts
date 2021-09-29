import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IColour } from '../colour.model';

@Component({
  selector: 'jhi-colour-detail',
  templateUrl: './colour-detail.component.html',
})
export class ColourDetailComponent implements OnInit {
  colour: IColour | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ colour }) => {
      this.colour = colour;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
