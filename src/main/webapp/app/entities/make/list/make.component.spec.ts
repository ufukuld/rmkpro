import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MakeService } from '../service/make.service';

import { MakeComponent } from './make.component';

describe('Component Tests', () => {
  describe('Make Management Component', () => {
    let comp: MakeComponent;
    let fixture: ComponentFixture<MakeComponent>;
    let service: MakeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MakeComponent],
      })
        .overrideTemplate(MakeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MakeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MakeService);

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
      expect(comp.makes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
