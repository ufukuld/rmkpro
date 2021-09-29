import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehicleImages, getVehicleImagesIdentifier } from '../vehicle-images.model';

export type EntityResponseType = HttpResponse<IVehicleImages>;
export type EntityArrayResponseType = HttpResponse<IVehicleImages[]>;

@Injectable({ providedIn: 'root' })
export class VehicleImagesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicle-images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vehicleImages: IVehicleImages): Observable<EntityResponseType> {
    return this.http.post<IVehicleImages>(this.resourceUrl, vehicleImages, { observe: 'response' });
  }

  update(vehicleImages: IVehicleImages): Observable<EntityResponseType> {
    return this.http.put<IVehicleImages>(`${this.resourceUrl}/${getVehicleImagesIdentifier(vehicleImages) as number}`, vehicleImages, {
      observe: 'response',
    });
  }

  partialUpdate(vehicleImages: IVehicleImages): Observable<EntityResponseType> {
    return this.http.patch<IVehicleImages>(`${this.resourceUrl}/${getVehicleImagesIdentifier(vehicleImages) as number}`, vehicleImages, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVehicleImages>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVehicleImages[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVehicleImagesToCollectionIfMissing(
    vehicleImagesCollection: IVehicleImages[],
    ...vehicleImagesToCheck: (IVehicleImages | null | undefined)[]
  ): IVehicleImages[] {
    const vehicleImages: IVehicleImages[] = vehicleImagesToCheck.filter(isPresent);
    if (vehicleImages.length > 0) {
      const vehicleImagesCollectionIdentifiers = vehicleImagesCollection.map(
        vehicleImagesItem => getVehicleImagesIdentifier(vehicleImagesItem)!
      );
      const vehicleImagesToAdd = vehicleImages.filter(vehicleImagesItem => {
        const vehicleImagesIdentifier = getVehicleImagesIdentifier(vehicleImagesItem);
        if (vehicleImagesIdentifier == null || vehicleImagesCollectionIdentifiers.includes(vehicleImagesIdentifier)) {
          return false;
        }
        vehicleImagesCollectionIdentifiers.push(vehicleImagesIdentifier);
        return true;
      });
      return [...vehicleImagesToAdd, ...vehicleImagesCollection];
    }
    return vehicleImagesCollection;
  }
}
