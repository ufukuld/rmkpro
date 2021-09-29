import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICosts, Costs } from '../costs.model';
import { CostsService } from '../service/costs.service';

@Injectable({ providedIn: 'root' })
export class CostsRoutingResolveService implements Resolve<ICosts> {
  constructor(protected service: CostsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICosts> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((costs: HttpResponse<Costs>) => {
          if (costs.body) {
            return of(costs.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Costs());
  }
}
