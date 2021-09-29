import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TrimService } from '../service/trim.service';

import { TrimComponent } from './trim.component';

describe('Component Tests', () => {
  describe('Trim Management Component', () => {
    let comp: TrimComponent;
    let fixture: ComponentFixture<TrimComponent>;
    let service: TrimService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TrimComponent],
      })
        .overrideTemplate(TrimComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TrimComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TrimService);

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
      expect(comp.trims?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
