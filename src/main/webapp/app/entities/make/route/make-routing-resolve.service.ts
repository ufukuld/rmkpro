import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMake, Make } from '../make.model';
import { MakeService } from '../service/make.service';

@Injectable({ providedIn: 'root' })
export class MakeRoutingResolveService implements Resolve<IMake> {
  constructor(protected service: MakeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMake> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((make: HttpResponse<Make>) => {
          if (make.body) {
            return of(make.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Make());
  }
}
