import { FetchHttpClient } from '../data/http/HttpClient';
import { OpenMeteoWeatherService } from '../data/providers/openMeteo/OpenMeteoWeatherService';
import { MeteoblueWeatherService } from '../data/providers/meteoblue/MeteoblueWeatherService';
import { WeatherRepositoryImpl } from '../data/repositories/WeatherRepositoryImpl';
import { StubLocationProvider } from '../data/location/StubLocationProvider';
import { GetWeatherByLocationUseCase } from '../domain/useCases/GetWeatherByLocationUseCase';
import { GetWeatherForCurrentLocationUseCase } from '../domain/useCases/GetWeatherForCurrentLocationUseCase';

const httpClient = new FetchHttpClient();

const openMeteoService = new OpenMeteoWeatherService(httpClient);

const meteoblueApiKey = 'REPLACE_WITH_METEOBLUE_API_KEY';
const meteoblueService = new MeteoblueWeatherService(httpClient, meteoblueApiKey);

const weatherRepository = new WeatherRepositoryImpl([openMeteoService, meteoblueService]);

const locationProvider = new StubLocationProvider();

const getWeatherByLocationUseCase = new GetWeatherByLocationUseCase(weatherRepository);
const getWeatherForCurrentLocationUseCase = new GetWeatherForCurrentLocationUseCase(
  locationProvider,
  weatherRepository,
);

export const weatherDependencies = {
  weatherRepository,
  getWeatherByLocationUseCase,
  getWeatherForCurrentLocationUseCase,
};
