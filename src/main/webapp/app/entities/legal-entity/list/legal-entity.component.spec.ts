import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LegalEntityService } from '../service/legal-entity.service';

import { LegalEntityComponent } from './legal-entity.component';

describe('Component Tests', () => {
  describe('LegalEntity Management Component', () => {
    let comp: LegalEntityComponent;
    let fixture: ComponentFixture<LegalEntityComponent>;
    let service: LegalEntityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LegalEntityComponent],
      })
        .overrideTemplate(LegalEntityComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LegalEntityComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LegalEntityService);

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
      expect(comp.legalEntities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
