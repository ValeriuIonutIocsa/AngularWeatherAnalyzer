import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

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
