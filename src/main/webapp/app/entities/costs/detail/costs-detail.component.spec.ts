import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CostsDetailComponent } from './costs-detail.component';

describe('Component Tests', () => {
  describe('Costs Management Detail Component', () => {
    let comp: CostsDetailComponent;
    let fixture: ComponentFixture<CostsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CostsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ costs: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CostsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CostsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load costs on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.costs).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
