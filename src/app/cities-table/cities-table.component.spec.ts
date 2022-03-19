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

  it(`should add`, () => {
    const fixture = TestBed.createComponent(CitiesTableComponent);
    const app = fixture.componentInstance;
    expect(app.add(3)).toEqual(4);
  });
});
