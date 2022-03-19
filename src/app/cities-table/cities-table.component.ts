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

  data: CityPojo[] = [];
  isLoadingResults = true;
  failedToReceiveData = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private httpClient: HttpClient) {
  }

  ngAfterViewInit() {

    merge(this.sort.sortChange).pipe(startWith({})).subscribe(() => {

      console.log('');
      console.log('loading results');
      this.isLoadingResults = true;
      let sortColumn: string = this.sort.active;
      let sortDirection: SortDirection = this.sort.direction;
      this.getRepoIssues(sortColumn, sortDirection);
    });
  }

  getRepoIssues(
    sortColumn: string,
    sortDirection: SortDirection) {

    var localServer: boolean;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      localServer = true;
    } else {
      localServer = false;
    }

    var hostname: string;
    if (localServer) {
      hostname = 'localhost';
    } else {
      hostname = '79.114.21.193';
    }

    const port: number = 9010;

    let ipAddressRequestUrl = 'http://api.ipify.org/?format=json';
    console.log('getting public IP address from:');
    console.log(ipAddressRequestUrl);
    this.httpClient.get(ipAddressRequestUrl).subscribe(
      (res: any) => {

        let ipAddress = res.ip;
        this.sendRequestUrl(hostname, port, ipAddress, sortColumn, sortDirection);
      },
      (error: any) => {

        console.error(error);
        let ipAddress = 'N/A';
        this.sendRequestUrl(hostname, port, ipAddress, sortColumn, sortDirection);
      });
  }

  sendRequestUrl(
    hostname: string,
    port: number,
    ipAddress: string,
    sortColumn: string,
    sortDirection: SortDirection) {

    const requestUrl = `http://${hostname}:${port}/retrieve_table_data` +
      `?ipAddress=${ipAddress}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;
    console.log('request URL:');
    console.log(requestUrl);

    this.httpClient.get<CitiesPojo>(requestUrl).subscribe(
      citiesPojo => {
        this.computeData(citiesPojo);
      },
      error => {
        console.error(error);
        this.computeData(null);
      });
  }

  computeData(
    citiesPojo: CitiesPojo) {

    let data: CityPojo[];
    this.isLoadingResults = false;
    this.failedToReceiveData = citiesPojo === null;
    if (citiesPojo === null) {
      data = [];
    } else {
      data = citiesPojo.cityPojoList;
    }
    this.data = data;
    console.log('results count: ' + this.data.length);
  }

  parseWeather(
    city: City,
    callback: Function) {
    city.parseWeather(this.httpClient, callback);
  }
}

export interface CitiesPojo {
  cityPojoList: CityPojo[];
}

export interface CityPojo {

  cityName: string;
  currLowTemp: number;
  currHighTemp: number;
  histLowTemp: number;
  histHighTemp: number;
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
      .append('Content-Type', 'text/plain; charset=utf-8')
      .append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)');

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

    htmlContent = htmlContent.replace("&#xB0;", "");
    this.parseWeatherHtmlContent(htmlContent, urlString, callback);
  }

  parseWeatherHtmlContent(
    htmlContent: string,
    urlString: string,
    callback: Function) {

    const parser: DOMParser = new DOMParser();
    const xmlDoc = parser.parseFromString(htmlContent, "text/xml");

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
      console.log('1111 ' + this.currHighTemp);
      console.log('1111 ' + this.currLowTemp);
      console.log('1111 ' + this.histHighTemp);
      console.log('1111 ' + this.histLowTemp);
    }
  }
}
