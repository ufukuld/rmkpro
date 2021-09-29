import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICosts, getCostsIdentifier } from '../costs.model';

export type EntityResponseType = HttpResponse<ICosts>;
export type EntityArrayResponseType = HttpResponse<ICosts[]>;

@Injectable({ providedIn: 'root' })
export class CostsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/costs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(costs: ICosts): Observable<EntityResponseType> {
    return this.http.post<ICosts>(this.resourceUrl, costs, { observe: 'response' });
  }

  update(costs: ICosts): Observable<EntityResponseType> {
    return this.http.put<ICosts>(`${this.resourceUrl}/${getCostsIdentifier(costs) as number}`, costs, { observe: 'response' });
  }

  partialUpdate(costs: ICosts): Observable<EntityResponseType> {
    return this.http.patch<ICosts>(`${this.resourceUrl}/${getCostsIdentifier(costs) as number}`, costs, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICosts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICosts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCostsToCollectionIfMissing(costsCollection: ICosts[], ...costsToCheck: (ICosts | null | undefined)[]): ICosts[] {
    const costs: ICosts[] = costsToCheck.filter(isPresent);
    if (costs.length > 0) {
      const costsCollectionIdentifiers = costsCollection.map(costsItem => getCostsIdentifier(costsItem)!);
      const costsToAdd = costs.filter(costsItem => {
        const costsIdentifier = getCostsIdentifier(costsItem);
        if (costsIdentifier == null || costsCollectionIdentifiers.includes(costsIdentifier)) {
          return false;
        }
        costsCollectionIdentifiers.push(costsIdentifier);
        return true;
      });
      return [...costsToAdd, ...costsCollection];
    }
    return costsCollection;
  }
}
