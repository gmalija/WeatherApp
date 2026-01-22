import { Location } from '../../domain/entities/Location';
import { WeatherForecast, CurrentWeather, DailyWeather } from '../../domain/entities/WeatherForecast';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';

export interface MeteoblueData1h {
  time: string[];
  temperature: number[];
  windspeed: number[];
  precipitation: number[];
  pictocode: number[];
}

export interface MeteoblueResponse {
  metadata: {
    latitude: number;
    longitude: number;
  };
  data_1h: MeteoblueData1h;
}

interface DailyAggregation {
  date: string;
  minTemp: number;
  maxTemp: number;
  windSpeedMax: number;
  precipitationSum: number;
  weatherCode: number;
}

export function mapMeteoblueToWeatherForecast(
  response: MeteoblueResponse,
  location: Location,
  providerId: WeatherProviderId,
): WeatherForecast {
  const { time, temperature, windspeed, precipitation, pictocode } = response.data_1h;

  if (!time.length) {
    throw new Error('Meteoblue response contains no hourly data');
  }

  const currentIndex = 0;

  const current: CurrentWeather = {
    time: new Date(`${time[currentIndex]}Z`),
    temperature: temperature[currentIndex],
    windSpeed: windspeed[currentIndex],
    precipitation: precipitation[currentIndex],
    weatherCode: pictocode[currentIndex],
  };

  const aggregations = new Map<string, DailyAggregation>();

  for (let i = 0; i < time.length; i += 1) {
    const [datePart] = time[i].split(' ');
    const existing = aggregations.get(datePart);

    if (!existing) {
      aggregations.set(datePart, {
        date: datePart,
        minTemp: temperature[i],
        maxTemp: temperature[i],
        windSpeedMax: windspeed[i],
        precipitationSum: precipitation[i],
        weatherCode: pictocode[i],
      });
    } else {
      existing.minTemp = Math.min(existing.minTemp, temperature[i]);
      existing.maxTemp = Math.max(existing.maxTemp, temperature[i]);
      existing.windSpeedMax = Math.max(existing.windSpeedMax, windspeed[i]);
      existing.precipitationSum += precipitation[i];
    }
  }

  const daily: DailyWeather[] = Array.from(aggregations.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((agg) => ({
      date: new Date(`${agg.date}T00:00:00Z`),
      minTemp: agg.minTemp,
      maxTemp: agg.maxTemp,
      windSpeedMax: agg.windSpeedMax,
      precipitationSum: agg.precipitationSum,
      weatherCode: agg.weatherCode,
    }));

  return {
    location,
    providerId,
    current,
    daily,
  };
}
