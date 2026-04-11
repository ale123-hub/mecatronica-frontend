declare var describe: any;
declare var it: any;
declare var beforeEach: any;
declare var expect: any;
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionalComponent } from './institucional.component';

describe('InstitucionalComponent', () => {
  let component: InstitucionalComponent;
  let fixture: ComponentFixture<InstitucionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitucionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitucionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
