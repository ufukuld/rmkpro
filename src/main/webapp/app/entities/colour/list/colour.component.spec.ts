import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ColourService } from '../service/colour.service';

import { ColourComponent } from './colour.component';

describe('Component Tests', () => {
  describe('Colour Management Component', () => {
    let comp: ColourComponent;
    let fixture: ComponentFixture<ColourComponent>;
    let service: ColourService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ColourComponent],
      })
        .overrideTemplate(ColourComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ColourComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ColourService);

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
      expect(comp.colours?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
