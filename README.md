# WeatherApp

A React Native weather application built with Clean Architecture, providing weather forecasts using multiple weather providers. The app allows users to fetch weather data by location name or current GPS location, supporting OpenMeteo and Meteoblue APIs.

## Features

- **Weather by Location**: Enter a city name to get current weather and forecasts.
- **Current Location Weather**: Automatically fetch weather using device GPS.
- **Multiple Providers**: Supports OpenMeteo (free) and Meteoblue (API key required) for weather data.
- **Clean Architecture**: Organized into Domain, Data, Presentation, and Application layers for maintainability.
- **State Management**: Uses view models with React hooks, migrating from Redux.
- **Geocoding**: Integrates with Nominatim (OpenStreetMap) for location searches.
- **Cross-Platform**: Runs on Android and iOS.

## Architecture Overview

The app follows Clean Architecture principles with four main layers:

- **Domain**: Core business logic, including entities, use cases, repositories, and value objects.
- **Data**: External integrations, such as API clients, mappers, and repository implementations.
- **Presentation**: UI components, screens, view models, and Redux state (in migration).
- **Application**: Dependency injection wired in `weatherDependencies.ts`.

Data flows from API responses through mappers to domain entities, then to view models, and finally to UI components.

## Prerequisites

- Node.js (version 20+)
- React Native development environment set up (see [React Native docs](https://reactnative.dev/docs/set-up-your-environment))
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and SDK

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd WeatherApp
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. For iOS, install CocoaPods dependencies:
   ```sh
   bundle install
   bundle exec pod install
   ```

4. Set up environment variables:
   ```sh
   cp .env.dev .env
   ```

   Then edit `.env` and add your Meteoblue API key:
   ```
   METEOBLUE_API_KEY=your_api_key_here
   ```

   Get your API key from [Meteoblue Weather API](https://www.meteoblue.com/en/weather-api).

## Running the App

1. Start Metro (the React Native bundler):
   ```sh
   npm start
   ```

2. In a new terminal, run on Android:
   ```sh
   npm run android
   ```

   Or on iOS:
   ```sh
   npm run ios
   ```

The app should launch in the emulator or connected device.

## Testing

- Run unit tests:
  ```sh
  npm test
  ```

- Run linting:
  ```sh
  npm run lint
  ```

## Building

- For production builds, use the standard React Native build commands or build directly from Android Studio/XCode.

## Cleaning

To perform a full clean (removes node_modules, builds, caches):
```sh
npm run clean-manual
```

## Development Workflows

- **Build**: `npm start` for Metro, `npm run android/ios` for platform builds.
- **Test**: `npm test` for Jest, `npm run lint` for ESLint.
- **Clean**: `npm run clean-manual` for full reset.
- **iOS Setup**: `bundle install && bundle exec pod install` after dependency changes.

## External Dependencies

- **Weather APIs**: OpenMeteo (free), Meteoblue (requires API key).
- **Geocoding**: Nominatim (OpenStreetMap).
- **Maps/Location**: Device GPS for current location.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make changes and add tests.
4. Run tests and linting.
5. Submit a pull request.

## License

This project is licensed under the MIT License.
