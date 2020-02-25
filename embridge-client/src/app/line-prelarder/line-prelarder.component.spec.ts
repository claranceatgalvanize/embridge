import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinePrelarderComponent } from './line-prelarder.component';

describe('LinePrelarderComponent', () => {
  let component: LinePrelarderComponent;
  let fixture: ComponentFixture<LinePrelarderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinePrelarderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePrelarderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
