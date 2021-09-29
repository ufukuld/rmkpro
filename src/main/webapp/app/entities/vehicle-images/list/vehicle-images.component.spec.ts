import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VehicleImagesService } from '../service/vehicle-images.service';

import { VehicleImagesComponent } from './vehicle-images.component';

describe('Component Tests', () => {
  describe('VehicleImages Management Component', () => {
    let comp: VehicleImagesComponent;
    let fixture: ComponentFixture<VehicleImagesComponent>;
    let service: VehicleImagesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehicleImagesComponent],
      })
        .overrideTemplate(VehicleImagesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehicleImagesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VehicleImagesService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.vehicleImages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
