import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrim, getTrimIdentifier } from '../trim.model';

export type EntityResponseType = HttpResponse<ITrim>;
export type EntityArrayResponseType = HttpResponse<ITrim[]>;

@Injectable({ providedIn: 'root' })
export class TrimService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trims');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trim: ITrim): Observable<EntityResponseType> {
    return this.http.post<ITrim>(this.resourceUrl, trim, { observe: 'response' });
  }

  update(trim: ITrim): Observable<EntityResponseType> {
    return this.http.put<ITrim>(`${this.resourceUrl}/${getTrimIdentifier(trim) as number}`, trim, { observe: 'response' });
  }

  partialUpdate(trim: ITrim): Observable<EntityResponseType> {
    return this.http.patch<ITrim>(`${this.resourceUrl}/${getTrimIdentifier(trim) as number}`, trim, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrim>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrim[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTrimToCollectionIfMissing(trimCollection: ITrim[], ...trimsToCheck: (ITrim | null | undefined)[]): ITrim[] {
    const trims: ITrim[] = trimsToCheck.filter(isPresent);
    if (trims.length > 0) {
      const trimCollectionIdentifiers = trimCollection.map(trimItem => getTrimIdentifier(trimItem)!);
      const trimsToAdd = trims.filter(trimItem => {
        const trimIdentifier = getTrimIdentifier(trimItem);
        if (trimIdentifier == null || trimCollectionIdentifiers.includes(trimIdentifier)) {
          return false;
        }
        trimCollectionIdentifiers.push(trimIdentifier);
        return true;
      });
      return [...trimsToAdd, ...trimCollection];
    }
    return trimCollection;
  }
}
