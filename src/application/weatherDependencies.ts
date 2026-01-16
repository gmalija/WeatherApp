import { FetchHttpClient } from '../data/http/HttpClient';
import { OpenMeteoWeatherService } from '../data/providers/openMeteo/OpenMeteoWeatherService';
import { MeteoblueWeatherService } from '../data/providers/meteoblue/MeteoblueWeatherService';
import { WeatherRepositoryImpl } from '../data/repositories/WeatherRepositoryImpl';
import { GeolocationLocationProvider } from '../data/location/GeolocationLocationProvider';
import { OpenMeteoGeocodingService } from '../data/geocoding/OpenMeteoGeocodingService';
import { GetWeatherByLocationUseCase } from '../domain/useCases/GetWeatherByLocationUseCase';
import { GetWeatherForCurrentLocationUseCase } from '../domain/useCases/GetWeatherForCurrentLocationUseCase';

const httpClient = new FetchHttpClient();

const openMeteoService = new OpenMeteoWeatherService(httpClient);

const meteoblueApiKey = 'xEeouDJW08hQfb41';
const meteoblueService = new MeteoblueWeatherService(httpClient, meteoblueApiKey);

const weatherRepository = new WeatherRepositoryImpl([openMeteoService, meteoblueService]);

const geocodingService = new OpenMeteoGeocodingService(httpClient);
const locationProvider = new GeolocationLocationProvider();

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
