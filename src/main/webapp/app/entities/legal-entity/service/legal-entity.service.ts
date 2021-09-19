import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILegalEntity, getLegalEntityIdentifier } from '../legal-entity.model';

export type EntityResponseType = HttpResponse<ILegalEntity>;
export type EntityArrayResponseType = HttpResponse<ILegalEntity[]>;

@Injectable({ providedIn: 'root' })
export class LegalEntityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/legal-entities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(legalEntity: ILegalEntity): Observable<EntityResponseType> {
    return this.http.post<ILegalEntity>(this.resourceUrl, legalEntity, { observe: 'response' });
  }

  update(legalEntity: ILegalEntity): Observable<EntityResponseType> {
    return this.http.put<ILegalEntity>(`${this.resourceUrl}/${getLegalEntityIdentifier(legalEntity) as number}`, legalEntity, {
      observe: 'response',
    });
  }

  partialUpdate(legalEntity: ILegalEntity): Observable<EntityResponseType> {
    return this.http.patch<ILegalEntity>(`${this.resourceUrl}/${getLegalEntityIdentifier(legalEntity) as number}`, legalEntity, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILegalEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILegalEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLegalEntityToCollectionIfMissing(
    legalEntityCollection: ILegalEntity[],
    ...legalEntitiesToCheck: (ILegalEntity | null | undefined)[]
  ): ILegalEntity[] {
    const legalEntities: ILegalEntity[] = legalEntitiesToCheck.filter(isPresent);
    if (legalEntities.length > 0) {
      const legalEntityCollectionIdentifiers = legalEntityCollection.map(legalEntityItem => getLegalEntityIdentifier(legalEntityItem)!);
      const legalEntitiesToAdd = legalEntities.filter(legalEntityItem => {
        const legalEntityIdentifier = getLegalEntityIdentifier(legalEntityItem);
        if (legalEntityIdentifier == null || legalEntityCollectionIdentifiers.includes(legalEntityIdentifier)) {
          return false;
        }
        legalEntityCollectionIdentifiers.push(legalEntityIdentifier);
        return true;
      });
      return [...legalEntitiesToAdd, ...legalEntityCollection];
    }
    return legalEntityCollection;
  }
}
