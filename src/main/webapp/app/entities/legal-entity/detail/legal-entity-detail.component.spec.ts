import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LegalEntityDetailComponent } from './legal-entity-detail.component';

describe('Component Tests', () => {
  describe('LegalEntity Management Detail Component', () => {
    let comp: LegalEntityDetailComponent;
    let fixture: ComponentFixture<LegalEntityDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LegalEntityDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ legalEntity: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LegalEntityDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LegalEntityDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load legalEntity on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.legalEntity).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
