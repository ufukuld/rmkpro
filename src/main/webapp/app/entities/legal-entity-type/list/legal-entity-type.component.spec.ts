import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LegalEntityTypeService } from '../service/legal-entity-type.service';

import { LegalEntityTypeComponent } from './legal-entity-type.component';

describe('Component Tests', () => {
  describe('LegalEntityType Management Component', () => {
    let comp: LegalEntityTypeComponent;
    let fixture: ComponentFixture<LegalEntityTypeComponent>;
    let service: LegalEntityTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LegalEntityTypeComponent],
      })
        .overrideTemplate(LegalEntityTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LegalEntityTypeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LegalEntityTypeService);

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
      expect(comp.legalEntityTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
