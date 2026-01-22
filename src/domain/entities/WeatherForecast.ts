import { Location } from './Location';
import { WeatherProviderId } from '../valueObjects/WeatherProviderId';

export interface CurrentWeather {
  time: Date;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
}

export interface DailyWeather {
  date: Date;
  minTemp: number;
  maxTemp: number;
  windSpeedMax: number;
  precipitationSum: number;
  weatherCode: number;
}

export interface WeatherForecast {
  location: Location;
  providerId: WeatherProviderId;
  current: CurrentWeather;
  daily: DailyWeather[];
}
