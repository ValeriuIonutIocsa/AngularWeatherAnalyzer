import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { CitiesTableComponent, City } from './cities-table.component';

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

  it(`should parse weather`, (done) => {
    fixture = TestBed.createComponent(CitiesTableComponent);
    component = fixture.componentInstance;

    const cityName: string = "Timisoara";
    const latitude: number = 45.7537;
    const longitude: number = 21.2257;
    const city: City = new City(cityName, latitude, longitude);
    const cities: City[] = [city];

    component.parseWeather(cities, '', '');

    expect(city.currLowTemp != null).toBeTruthy();
    expect(city.currHighTemp != null).toBeTruthy();
    expect(city.histLowTemp != null).toBeTruthy();
    expect(city.histHighTemp != null).toBeTruthy();
    done();
  });
});
