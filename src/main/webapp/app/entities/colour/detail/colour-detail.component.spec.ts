import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ColourDetailComponent } from './colour-detail.component';

describe('Component Tests', () => {
  describe('Colour Management Detail Component', () => {
    let comp: ColourDetailComponent;
    let fixture: ComponentFixture<ColourDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ColourDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ colour: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ColourDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ColourDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load colour on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.colour).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
