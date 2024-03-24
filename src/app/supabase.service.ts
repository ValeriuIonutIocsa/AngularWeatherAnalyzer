import { Injectable } from '@angular/core';

import {
  createClient,
  SupabaseClient
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

export interface CityData {
  cityId: number,
  cityName: string
}

export interface HistDataEntry {
  cityId: number,
  minTempDegCel: number,
  maxTempDegCel: number
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient

  constructor() {

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  async loadCityData(): Promise<CityData[]> {

    const { data, error } = await this.supabase
      .from('WeatherDatabaseCities')
      .select(`Id, Name`);

    if (error) {
      console.error(error);
      return [];
    }

    return data.map((dbRow) => ({
      cityId: dbRow.Id,
      cityName: dbRow.Name
    }));
  }

  async loadHistData(
    month: number,
    day: number): Promise<HistDataEntry[]> {

    const { data, error } = await this.supabase
      .from('WeatherAnalyzerHistData')
      .select(`CityId, MinTempDegCel, MaxTempDegCel`)
      .eq('Month', month)
      .eq('Day', day);

    if (error) {
      console.error(error);
      return [];
    }

    return data.map((dbRow) => ({
      cityId: dbRow.CityId,
      minTempDegCel: dbRow.MinTempDegCel,
      maxTempDegCel: dbRow.MaxTempDegCel
    }));
  }
}
