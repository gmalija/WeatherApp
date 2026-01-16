import { Location } from '../../domain/entities/Location';
import { WeatherForecast, CurrentWeather, DailyWeather } from '../../domain/entities/WeatherForecast';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  wind_speed_10m: number;
  precipitation: number;
  weather_code: number;
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  wind_speed_10m_max: number[];
  rain_sum?: number[];
  precipitation_sum?: number[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
}

export function mapOpenMeteoToWeatherForecast(
  response: OpenMeteoResponse,
  location: Location,
  providerId: WeatherProviderId,
): WeatherForecast {
  const current: CurrentWeather = {
    time: new Date(response.current.time),
    temperature: response.current.temperature_2m,
    windSpeed: response.current.wind_speed_10m,
    precipitation: response.current.precipitation,
    weatherCode: response.current.weather_code,
  };

  const daily: DailyWeather[] = [];
  const { time, weather_code, temperature_2m_max, temperature_2m_min, wind_speed_10m_max, rain_sum, precipitation_sum } =
    response.daily;

  const length = time.length;

  for (let i = 0; i < length; i += 1) {
    const date = new Date(`${time[i]}T00:00:00Z`);
    const minTemp = temperature_2m_min[i];
    const maxTemp = temperature_2m_max[i];
    const windSpeedMax = wind_speed_10m_max[i];
    const precipitationFromPrecipitation = precipitation_sum && precipitation_sum[i] !== undefined ? precipitation_sum[i] : 0;
    const precipitationFromRain = rain_sum && rain_sum[i] !== undefined ? rain_sum[i] : 0;
    const precipitationSum = precipitationFromPrecipitation || precipitationFromRain;
    const code = weather_code[i];

    daily.push({
      date,
      minTemp,
      maxTemp,
      windSpeedMax,
      precipitationSum,
      weatherCode: code,
    });
  }

  return {
    location,
    providerId,
    current,
    daily,
  };
}
