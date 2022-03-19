import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { CitiesTableComponent } from './cities-table.component';

describe('CitiesTableComponent', () => {
  let component: CitiesTableComponent;
  let fixture: ComponentFixture<CitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      declarations: [
        CitiesTableComponent,
        MatSort
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should increment`, () => {
    const fixture = TestBed.createComponent(CitiesTableComponent);
    const app = fixture.componentInstance;
    const result = app.increment(3);
    expect(result).toEqual(4);
    const result2 = app.increment(-1);
    expect(result2).toEqual(0);
  });
});
