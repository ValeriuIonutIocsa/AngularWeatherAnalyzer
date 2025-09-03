import { Component } from '@angular/core';

import { CitiesTableComponent } from './cities-table/cities-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CitiesTableComponent]
})
export class AppComponent {
  title = 'AngularWeatherAnalyzer';
}
