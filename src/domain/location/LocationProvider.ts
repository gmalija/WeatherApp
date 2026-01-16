import { Location } from '../entities/Location';

export interface LocationProvider {
  getCurrentLocation(): Promise<Location>;
}
