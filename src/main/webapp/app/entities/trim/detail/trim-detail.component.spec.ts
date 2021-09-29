import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrimDetailComponent } from './trim-detail.component';

describe('Component Tests', () => {
  describe('Trim Management Detail Component', () => {
    let comp: TrimDetailComponent;
    let fixture: ComponentFixture<TrimDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TrimDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ trim: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TrimDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TrimDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load trim on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.trim).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
