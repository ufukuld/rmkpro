import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IColour, getColourIdentifier } from '../colour.model';

export type EntityResponseType = HttpResponse<IColour>;
export type EntityArrayResponseType = HttpResponse<IColour[]>;

@Injectable({ providedIn: 'root' })
export class ColourService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/colours');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(colour: IColour): Observable<EntityResponseType> {
    return this.http.post<IColour>(this.resourceUrl, colour, { observe: 'response' });
  }

  update(colour: IColour): Observable<EntityResponseType> {
    return this.http.put<IColour>(`${this.resourceUrl}/${getColourIdentifier(colour) as number}`, colour, { observe: 'response' });
  }

  partialUpdate(colour: IColour): Observable<EntityResponseType> {
    return this.http.patch<IColour>(`${this.resourceUrl}/${getColourIdentifier(colour) as number}`, colour, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IColour>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IColour[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addColourToCollectionIfMissing(colourCollection: IColour[], ...coloursToCheck: (IColour | null | undefined)[]): IColour[] {
    const colours: IColour[] = coloursToCheck.filter(isPresent);
    if (colours.length > 0) {
      const colourCollectionIdentifiers = colourCollection.map(colourItem => getColourIdentifier(colourItem)!);
      const coloursToAdd = colours.filter(colourItem => {
        const colourIdentifier = getColourIdentifier(colourItem);
        if (colourIdentifier == null || colourCollectionIdentifiers.includes(colourIdentifier)) {
          return false;
        }
        colourCollectionIdentifiers.push(colourIdentifier);
        return true;
      });
      return [...coloursToAdd, ...colourCollection];
    }
    return colourCollection;
  }
}
