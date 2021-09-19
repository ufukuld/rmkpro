import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ModelService } from '../service/model.service';

import { ModelComponent } from './model.component';

describe('Component Tests', () => {
  describe('Model Management Component', () => {
    let comp: ModelComponent;
    let fixture: ComponentFixture<ModelComponent>;
    let service: ModelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ModelComponent],
      })
        .overrideTemplate(ModelComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ModelComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ModelService);

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
      expect(comp.models?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
