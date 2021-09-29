import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IColour, Colour } from '../colour.model';
import { ColourService } from '../service/colour.service';

@Injectable({ providedIn: 'root' })
export class ColourRoutingResolveService implements Resolve<IColour> {
  constructor(protected service: ColourService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IColour> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((colour: HttpResponse<Colour>) => {
          if (colour.body) {
            return of(colour.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Colour());
  }
}
