import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MakeDetailComponent } from './make-detail.component';

describe('Component Tests', () => {
  describe('Make Management Detail Component', () => {
    let comp: MakeDetailComponent;
    let fixture: ComponentFixture<MakeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MakeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ make: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MakeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MakeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load make on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.make).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
