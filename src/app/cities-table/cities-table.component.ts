import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cities-table',
  templateUrl: './cities-table.component.html',
  styleUrls: ['./cities-table.component.css']
})
export class CitiesTableComponent implements AfterViewInit {

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
    private httpClient: HttpClient) {
  }

  ngAfterViewInit() {

    merge(this.sort.sortChange).pipe(startWith({})).subscribe(() => {

      console.log('');
      console.log('loading results');

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
      new City("Los Angeles", "los-angeles", "347625"),
      new City("Chicago", "chicago", "348308"),
      new City("New York", "new-york", "349727"),
      new City("Vancouver", "vancouver", "53286"),
      new City("Montreal", "montreal", "56186"),
      new City("Guadalajara", "guadalajara", "243735"),
      new City("Mexico City", "mexico-city", "242560"),
      new City("Rio de Janeiro", "rio-de-janeiro", "45449"),
      new City("Buenos Aires", "buenos-aires", "7894"),
      new City("Cape Town", "cape-town", "306633"),
      new City("Lisbon", "lisbon", "274087"),
      new City("Madrid", "madrid", "308526"),
      new City("London", "london", "328328"),
      new City("Paris", "paris", "623"),
      new City("Rome", "rome", "213490"),
      new City("Regensburg", "regensburg", "167556"),
      new City("Oslo", "oslo", "254946"),
      new City("Stockholm", "stockholm", "314929"),
      new City("Helsinki", "helsinki", "133328"),
      new City("Timisoara", "timisoara", "290867"),
      new City("Bucharest", "bucharest", "287430"),
      new City("Iasi", "iasi", "287994"),
      new City("Chisinau", "chisinau", "242405"),
      new City("Constanta", "constanta", "287719"),
      new City("Athens", "athens", "182536"),
      new City("Katerini", "katerini", "185828"),
      new City("Jerusalem", "jerusalem", "213225"),
      new City("Cairo", "cairo", "127164"),
      new City("Dubai", "dubai", "323091"),
      new City("Moscow", "moscow", "294021"),
      new City("Oymyakon", "oymyakon", "571464"),
      new City("Tehran", "tehran", "210841"),
      new City("Bengaluru", "bengaluru", "204108"),
      new City("Beijing", "beijing", "101924"),
      new City("Hong Kong", "hong-kong", "1123655"),
      new City("Seoul", "seoul", "226081"),
      new City("Busan", "busan", "222888"),
      new City("Tokyo", "tokyo", "226396"),
      new City("Baybay", "baybay-city", "263946"),
      new City("Manila", "manila", "264885"),
      new City("Perth", "perth", "26797"),
      new City("Sidney", "sidney", "22889"),
      new City("Honolulu", "honolulu", "348211")
    ];

    const c = this.counter(cities.length);
    c.finished.then(() => {

      sessionStorage.setItem('cities', JSON.stringify(cities));
      this.sortData(cities, sortColumn, sortDirection);
    });
    cities.forEach(city => {

      this.parseWeather(city, () => {
        c.count();
      });
    });
  }

  parseWeather(
    city: City,
    callback: Function) {

    city.parseWeather(this.httpClient, callback);
  }

  sortData(
    cities: City[],
    sortColumn: string,
    sortDirection: string) {

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
  accuWeatherName: string;
  accuWeatherLocationKey: string;

  currLowTemp: number;
  currHighTemp: number;
  histLowTemp: number;
  histHighTemp: number;

  success: boolean;

  constructor(
    cityName: string,
    accuWeatherName: string,
    accuWeatherLocationKey: string) {

    this.cityName = cityName;
    this.accuWeatherName = accuWeatherName;
    this.accuWeatherLocationKey = accuWeatherLocationKey;
  }

  parseWeather(
    httpClient: HttpClient,
    callback: Function) {

    const urlString = "https://www.accuweather.com/en/ro/" +
      this.accuWeatherName + "/" +
      this.accuWeatherLocationKey + "/daily-weather-forecast/" +
      this.accuWeatherLocationKey + "?day=1";
    console.log(urlString);

    this.tryParseWeather(urlString, httpClient, 0, callback);
  }

  tryParseWeather(
    urlString: string,
    httpClient: HttpClient,
    trialIndex: number,
    callback: Function) {

    const httpHeaders: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'text/plain; charset=utf-8');

    httpClient.get(urlString, {
      headers: httpHeaders
    }).subscribe(
      data => {
        console.log(data);
      },
      error => {
        const responseData: string = error.error.text;
        if (responseData) {
          this.processWeatherData(responseData, urlString, callback);
        } else {
          if (trialIndex < 3) {
            this.tryParseWeather(urlString, httpClient, trialIndex + 1, callback);
          }
        }
      }
    );
  }

  processWeatherData(
    data: string,
    urlString: string,
    callback: Function) {

    var htmlContent: string = "";
    var inside: boolean = false;
    var outCount: number = 0;
    const dataLines: string[] = data.split('\n');
    dataLines.forEach(dataLine => {

      const trimmedDataLine = dataLine.trim();
      if (trimmedDataLine === "<div class=\"temp-history content-module\">") {
        inside = true;
      }
      if (inside) {

        htmlContent += dataLine;
        htmlContent += '\n';
        if (dataLine.includes("<div")) {
          outCount++;
        }
        if (dataLine.includes("</div>")) {

          outCount--;
          if (outCount == 0) {
            return;
          }
        }
      }
    });

    htmlContent = htmlContent.split("&#xB0;").join("");
    this.parseWeatherHtmlContent(htmlContent, urlString, callback);
  }

  parseWeatherHtmlContent(
    htmlContent: string,
    urlString: string,
    callback: Function) {

    const parser: DOMParser = new DOMParser();
    const xmlDoc = parser.parseFromString(htmlContent, "text/html");

    var currentTempElement: HTMLElement = null;
    var historicalTempElement: HTMLElement = null;
    const divElementList = xmlDoc.getElementsByTagName("div");
    for (var i = 0; i < divElementList.length; i++) {

      const divElement: HTMLDivElement = divElementList[i];
      const textContent: string = divElement.textContent;
      if (textContent === "Forecast") {
        currentTempElement = divElement.parentElement;
      } else if (textContent === "Average") {
        historicalTempElement = divElement.parentElement;
      }
    }

    if (currentTempElement != null) {

      const currentHighTempElement = currentTempElement.children[1];
      const currentHighTempString: string = currentHighTempElement.textContent;
      this.currHighTemp = parseInt(currentHighTempString);

      const currentLowTempElement = currentTempElement.children[2];
      const currentLowTempString: string = currentLowTempElement.textContent;
      this.currLowTemp = parseInt(currentLowTempString);
    }

    if (historicalTempElement != null) {

      const historicalHighTempElement = historicalTempElement.children[1];
      const historicalHighTempString: string = historicalHighTempElement.textContent;
      this.histHighTemp = parseInt(historicalHighTempString);

      const historicalLowTempElement = historicalTempElement.children[2];
      const historicalLowTempString: string = historicalLowTempElement.textContent;
      this.histLowTemp = parseInt(historicalLowTempString);
    }

    if (this.currHighTemp == null || this.currLowTemp == null ||
      this.histHighTemp == null || this.histLowTemp == null) {
      console.error("Received null temp for: " + urlString);

    } else {
      this.success = true;
      callback();
    }
  }
}
