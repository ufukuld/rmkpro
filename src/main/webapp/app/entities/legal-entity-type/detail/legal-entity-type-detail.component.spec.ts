import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LegalEntityTypeDetailComponent } from './legal-entity-type-detail.component';

describe('Component Tests', () => {
  describe('LegalEntityType Management Detail Component', () => {
    let comp: LegalEntityTypeDetailComponent;
    let fixture: ComponentFixture<LegalEntityTypeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LegalEntityTypeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ legalEntityType: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LegalEntityTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LegalEntityTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load legalEntityType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.legalEntityType).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
