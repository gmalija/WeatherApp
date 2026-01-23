import { FetchHttpClient } from '../data/http/HttpClient';
import { OpenMeteoWeatherService } from '../data/providers/openMeteo/OpenMeteoWeatherService';
import { MeteoblueWeatherService } from '../data/providers/meteoblue/MeteoblueWeatherService';
import { WeatherRepositoryImpl } from '../data/repositories/WeatherRepositoryImpl';
import { GeolocationLocationProvider } from '../data/location/GeolocationLocationProvider';
import { GetWeatherByLocationUseCase } from '../domain/useCases/GetWeatherByLocationUseCase';
import { GetWeatherForCurrentLocationUseCase } from '../domain/useCases/GetWeatherForCurrentLocationUseCase';
import { GeocodingService } from '../data/geocoding/GeocodingService.tsx';
import { METEOBLUE_API_KEY } from '@env';

const httpClient = new FetchHttpClient();

const openMeteoService = new OpenMeteoWeatherService(httpClient);

const meteoblueService = new MeteoblueWeatherService(httpClient, METEOBLUE_API_KEY);

const weatherRepository = new WeatherRepositoryImpl([openMeteoService, meteoblueService]);

const geocodingService = new GeocodingService(httpClient);
const locationProvider = new GeolocationLocationProvider(geocodingService);

const getWeatherByLocationUseCase = new GetWeatherByLocationUseCase(weatherRepository);
const getWeatherForCurrentLocationUseCase = new GetWeatherForCurrentLocationUseCase(
  locationProvider,
  weatherRepository,
);

export const weatherDependencies = {
  weatherRepository,
  geocodingService,
  getWeatherByLocationUseCase,
  getWeatherForCurrentLocationUseCase,
};
