import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { fetchWeatherApi } from 'openmeteo';

import { CityData, HistDataEntry, SupabaseService } from './../supabase.service'

@Component({
  selector: 'app-cities-table',
  templateUrl: './cities-table.component.html',
  styleUrls: ['./cities-table.component.css']
})
export class CitiesTableComponent implements AfterViewInit {

  private readonly supabase: SupabaseService

  displayedColumns: string[] = [
    'cityName',
    'currHighTemp',
    'currLowTemp',
    'histHighTemp',
    'histLowTemp',
    'diffHighTemp',
    'diffLowTemp'
  ];

  data: City[] = [];
  isLoadingResults: boolean = true;
  failedToReceiveData: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    supabase: SupabaseService) {

    this.supabase = supabase;
  }

  ngAfterViewInit() {

    merge(this.sort.sortChange).pipe(startWith({})).subscribe(() => {

      console.log(' --> loading results');

      this.data = [];
      this.isLoadingResults = true;
      this.failedToReceiveData = false;

      let sortColumn: string = this.sort.active;
      let sortDirection: SortDirection = this.sort.direction;

      const cities: City[] = JSON.parse(sessionStorage.getItem('cities'));
      if (cities) {
        this.sortData(cities, sortColumn, sortDirection)
      } else {
        this.createCityList(sortColumn, sortDirection);
      }
    });
  }

  createCityList(
    sortColumn: string,
    sortDirection: string) {

    const cities: City[] = [
      new City("Los Angeles", 34.0522, -118.2437),
      new City("Chicago", 41.85, -87.65),
      new City("New York", 40.7143, -74.006),
      new City("Vancouver", 49.2497, -123.1193),
      new City("Montreal", 45.5088, -73.5878),
      new City("Guadalajara", 20.6668, -103.3918),
      new City("Mexico City", 19.4285, -99.1277),
      new City("Rio de Janeiro", -22.9064, -43.1822),
      new City("Buenos Aires", -34.6131, -58.3772),
      new City("Cape Town", -33.9258, 18.4232),
      new City("Lisbon", 38.7167, -9.1333),
      new City("Madrid", 40.4165, -3.7026),
      new City("London", 51.5085, -0.1257),
      new City("Paris", 48.8534, 2.3488),
      new City("Rome", 41.8919, 12.5113),
      new City("Regensburg", 49.0151, 12.1016),
      new City("Oslo", 59.9127, 10.7461),
      new City("Stockholm", 59.3294, 18.0687),
      new City("Helsinki", 60.3172, 24.9633),
      new City("Timisoara", 45.7537, 21.2257),
      new City("Bucharest", 44.4323, 26.1063),
      new City("Iasi", 47.1667, 27.6),
      new City("Chisinau", 47.0056, 28.8575),
      new City("Constanta", 44.1807, 28.6343),
      new City("Athens", 37.9838, 23.7278),
      new City("Katerini", 40.2696, 22.5061),
      new City("Jerusalem", 31.769, 35.2163),
      new City("Cairo", 30.0626, 31.2497),
      new City("Dubai", 25.0772, 55.3093),
      new City("Moscow", 55.7522, 37.6156),
      new City("Oymyakon", 63.4622, 142.7949),
      new City("Tehran", 35.6944, 51.4215),
      new City("Bengaluru", 12.9719, 77.5937),
      new City("Beijing", 39.9075, 116.3972),
      new City("Hong Kong", 22.2783, 114.1747),
      new City("Seoul", 37.566, 126.9784),
      new City("Busan", 35.1017, 129.03),
      new City("Tokyo", 35.6895, 139.6917),
      new City("Baybay", 10.6785, 124.8006),
      new City("Manila", 14.6042, 120.9822),
      new City("Perth", -31.9522, 115.8614),
      new City("Sidney", 40.2842, -84.1555),
      new City("Honolulu", 21.3069, -157.8583)
    ];

    this.parseWeather(cities, sortColumn, sortDirection);
  }

  parseWeather(
    cities: City[],
    sortColumn: string,
    sortDirection: string) {

    console.log('configured ' + cities.length + ' cities');

    const c = this.counter(cities.length);
    c.finished.then(() => {

      sessionStorage.setItem('cities', JSON.stringify(cities));
      this.sortData(cities, sortColumn, sortDirection);
    });

    console.log(' --> loading city data from the database');
    this.supabase.loadCityData().then((cityDataList) => {

      console.log('loaded ' + cityDataList.length + ' city data entries from the database');
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;

      console.log(' --> loading historical data from the database');
      this.supabase.loadHistData(month, day).then((histDataEntryList) => {

        console.log('loaded ' + histDataEntryList.length + ' historical data entries from the database');
        cities.forEach(city => {

          city.parseWeather(cityDataList, histDataEntryList, () => {
            c.count();
          });
        });
      })
    });
  }

  sortData(
    cities: City[],
    sortColumn: string,
    sortDirection: string) {

    console.log(' --> sorting city list');
    cities.sort((city, otherCity) => {

      var result: number = 0;
      if ("cityName" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareStrings(city.cityName, otherCity.cityName);
        } else if ("desc" === sortDirection) {
          result = this.compareStringsRev(city.cityName, otherCity.cityName);
        }
      } else if ("currHighTemp" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareNumbers(city.currHighTemp, otherCity.currHighTemp);
        } else if ("desc" === sortDirection) {
          result = this.compareNumbersRev(city.currHighTemp, otherCity.currHighTemp);
        }
      } else if ("currLowTemp" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareNumbers(city.currLowTemp, otherCity.currLowTemp);
        } else if ("desc" === sortDirection) {
          result = this.compareNumbersRev(city.currLowTemp, otherCity.currLowTemp);
        }
      } else if ("histHighTemp" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareNumbers(city.histHighTemp, otherCity.histHighTemp);
        } else if ("desc" === sortDirection) {
          result = this.compareNumbersRev(city.histHighTemp, otherCity.histHighTemp);
        }
      } else if ("histLowTemp" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareNumbers(city.histLowTemp, otherCity.histLowTemp);
        } else if ("desc" === sortDirection) {
          result = this.compareNumbersRev(city.histLowTemp, otherCity.histLowTemp);
        }
      } else if ("diffHighTemp" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareNumbers(
            city.currHighTemp - city.histHighTemp,
            otherCity.currHighTemp - otherCity.histHighTemp);
        } else if ("desc" === sortDirection) {
          result = this.compareNumbersRev(
            city.currHighTemp - city.histHighTemp,
            otherCity.currHighTemp - otherCity.histHighTemp);
        }
      } else if ("diffLowTemp" === sortColumn) {
        if ("asc" === sortDirection) {
          result = this.compareNumbers(
            city.currLowTemp - city.histLowTemp,
            otherCity.currLowTemp - otherCity.histLowTemp);
        } else if ("desc" === sortDirection) {
          result = this.compareNumbersRev(
            city.currLowTemp - city.histLowTemp,
            otherCity.currLowTemp - otherCity.histLowTemp);
        }
      }
      return result;
    });
    this.data = cities;
    this.isLoadingResults = false;
  }

  compareStrings(a: string, b: string) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  compareStringsRev(a: string, b: string) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  }

  compareNumbers(a: number, b: number) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  compareNumbersRev(a: number, b: number) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  }

  counter(
    n: number): Counter {

    let i = 0;
    const res: Counter = new Counter();
    res.finished = new Promise(resolve => {
      res.count = () => {
        if (++i == n)
          resolve();
      };
    });
    return res;
  }
}

class Counter {

  finished: Promise<void>;
  count: Function;
}

export class City {

  cityName: string;
  latitude: number;
  longitude: number;

  currLowTemp: number;
  currHighTemp: number;
  histLowTemp: number;
  histHighTemp: number;

  success: boolean;

  constructor(
    cityName: string,
    latitude: number,
    longitude: number) {

    this.cityName = cityName;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  async parseWeather(
    cityDataList: CityData[],
    histDataEntryList: HistDataEntry[],
    callback: Function) {

    console.log(' --> parsing current weather for city ' + this.cityName);
    this.parseCurrentWeather().then(() => {

      console.log(' --> parsing historical weather for city ' + this.cityName);
      this.parseHistWeather(cityDataList, histDataEntryList);
      callback();
    });
  }

  async parseCurrentWeather() {

    const params = {
      "latitude": this.latitude,
      "longitude": this.longitude,
      "daily": ["temperature_2m_max", "temperature_2m_min"],
      "forecast_days": 1
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const daily = response.daily()!;

    const weatherData = {

      daily: {
        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2mMax: daily.variables(0)!.valuesArray()!,
        temperature2mMin: daily.variables(1)!.valuesArray()!,
      }
    };

    for (let i = 0; i < weatherData.daily.time.length; i++) {

      this.currLowTemp = Math.floor(weatherData.daily.temperature2mMin[i]);
      this.currHighTemp = Math.floor(weatherData.daily.temperature2mMax[i]);
    }
  }

  parseHistWeather(
    cityDataList: CityData[],
    histDataEntryList: HistDataEntry[]) {

    for (const cityData of cityDataList) {

      if (cityData.cityName == this.cityName) {

        const cityId = cityData.cityId;
        for (const histDataEntry of histDataEntryList) {

          if (histDataEntry.cityId == cityId) {

            this.histLowTemp = Math.floor(histDataEntry.minTempDegCel);
            this.histHighTemp = Math.floor(histDataEntry.maxTempDegCel);
          }
        }
      }
    }
  }
}
