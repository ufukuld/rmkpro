import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrim, Trim } from '../trim.model';
import { TrimService } from '../service/trim.service';

@Injectable({ providedIn: 'root' })
export class TrimRoutingResolveService implements Resolve<ITrim> {
  constructor(protected service: TrimService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrim> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((trim: HttpResponse<Trim>) => {
          if (trim.body) {
            return of(trim.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Trim());
  }
}
