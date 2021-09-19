import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILegalEntityType, getLegalEntityTypeIdentifier } from '../legal-entity-type.model';

export type EntityResponseType = HttpResponse<ILegalEntityType>;
export type EntityArrayResponseType = HttpResponse<ILegalEntityType[]>;

@Injectable({ providedIn: 'root' })
export class LegalEntityTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/legal-entity-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(legalEntityType: ILegalEntityType): Observable<EntityResponseType> {
    return this.http.post<ILegalEntityType>(this.resourceUrl, legalEntityType, { observe: 'response' });
  }

  update(legalEntityType: ILegalEntityType): Observable<EntityResponseType> {
    return this.http.put<ILegalEntityType>(
      `${this.resourceUrl}/${getLegalEntityTypeIdentifier(legalEntityType) as number}`,
      legalEntityType,
      { observe: 'response' }
    );
  }

  partialUpdate(legalEntityType: ILegalEntityType): Observable<EntityResponseType> {
    return this.http.patch<ILegalEntityType>(
      `${this.resourceUrl}/${getLegalEntityTypeIdentifier(legalEntityType) as number}`,
      legalEntityType,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILegalEntityType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILegalEntityType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLegalEntityTypeToCollectionIfMissing(
    legalEntityTypeCollection: ILegalEntityType[],
    ...legalEntityTypesToCheck: (ILegalEntityType | null | undefined)[]
  ): ILegalEntityType[] {
    const legalEntityTypes: ILegalEntityType[] = legalEntityTypesToCheck.filter(isPresent);
    if (legalEntityTypes.length > 0) {
      const legalEntityTypeCollectionIdentifiers = legalEntityTypeCollection.map(
        legalEntityTypeItem => getLegalEntityTypeIdentifier(legalEntityTypeItem)!
      );
      const legalEntityTypesToAdd = legalEntityTypes.filter(legalEntityTypeItem => {
        const legalEntityTypeIdentifier = getLegalEntityTypeIdentifier(legalEntityTypeItem);
        if (legalEntityTypeIdentifier == null || legalEntityTypeCollectionIdentifiers.includes(legalEntityTypeIdentifier)) {
          return false;
        }
        legalEntityTypeCollectionIdentifiers.push(legalEntityTypeIdentifier);
        return true;
      });
      return [...legalEntityTypesToAdd, ...legalEntityTypeCollection];
    }
    return legalEntityTypeCollection;
  }
}
