import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CostsService } from '../service/costs.service';

import { CostsComponent } from './costs.component';

describe('Component Tests', () => {
  describe('Costs Management Component', () => {
    let comp: CostsComponent;
    let fixture: ComponentFixture<CostsComponent>;
    let service: CostsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CostsComponent],
      })
        .overrideTemplate(CostsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CostsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CostsService);

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
      expect(comp.costs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
