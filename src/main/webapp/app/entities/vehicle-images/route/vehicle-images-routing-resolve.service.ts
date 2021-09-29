import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicleImages, VehicleImages } from '../vehicle-images.model';
import { VehicleImagesService } from '../service/vehicle-images.service';

@Injectable({ providedIn: 'root' })
export class VehicleImagesRoutingResolveService implements Resolve<IVehicleImages> {
  constructor(protected service: VehicleImagesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVehicleImages> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vehicleImages: HttpResponse<VehicleImages>) => {
          if (vehicleImages.body) {
            return of(vehicleImages.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new VehicleImages());
  }
}
