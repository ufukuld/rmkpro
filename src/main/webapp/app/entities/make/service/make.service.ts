import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMake, getMakeIdentifier } from '../make.model';

export type EntityResponseType = HttpResponse<IMake>;
export type EntityArrayResponseType = HttpResponse<IMake[]>;

@Injectable({ providedIn: 'root' })
export class MakeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/makes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(make: IMake): Observable<EntityResponseType> {
    return this.http.post<IMake>(this.resourceUrl, make, { observe: 'response' });
  }

  update(make: IMake): Observable<EntityResponseType> {
    return this.http.put<IMake>(`${this.resourceUrl}/${getMakeIdentifier(make) as number}`, make, { observe: 'response' });
  }

  partialUpdate(make: IMake): Observable<EntityResponseType> {
    return this.http.patch<IMake>(`${this.resourceUrl}/${getMakeIdentifier(make) as number}`, make, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMake>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMake[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMakeToCollectionIfMissing(makeCollection: IMake[], ...makesToCheck: (IMake | null | undefined)[]): IMake[] {
    const makes: IMake[] = makesToCheck.filter(isPresent);
    if (makes.length > 0) {
      const makeCollectionIdentifiers = makeCollection.map(makeItem => getMakeIdentifier(makeItem)!);
      const makesToAdd = makes.filter(makeItem => {
        const makeIdentifier = getMakeIdentifier(makeItem);
        if (makeIdentifier == null || makeCollectionIdentifiers.includes(makeIdentifier)) {
          return false;
        }
        makeCollectionIdentifiers.push(makeIdentifier);
        return true;
      });
      return [...makesToAdd, ...makeCollection];
    }
    return makeCollection;
  }
}
