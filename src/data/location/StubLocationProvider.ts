import type { Location } from '../../domain/entities/Location';
import type { LocationProvider } from '../../domain/location/LocationProvider';

export class StubLocationProvider implements LocationProvider {
  async getCurrentLocation(): Promise<Location> {
    return {
      latitude: 52.52,
      longitude: 13.41,
      name: 'Current location',
    };
  }
}
