import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILegalEntityType, LegalEntityType } from '../legal-entity-type.model';
import { LegalEntityTypeService } from '../service/legal-entity-type.service';

@Injectable({ providedIn: 'root' })
export class LegalEntityTypeRoutingResolveService implements Resolve<ILegalEntityType> {
  constructor(protected service: LegalEntityTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILegalEntityType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((legalEntityType: HttpResponse<LegalEntityType>) => {
          if (legalEntityType.body) {
            return of(legalEntityType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LegalEntityType());
  }
}
