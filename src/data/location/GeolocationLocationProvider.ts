import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

import type { Location } from '../../domain/entities/Location';
import type { LocationProvider } from '../../domain/location/LocationProvider';

export interface ReverseGeocoder {
  reverseGeocode(latitude: number, longitude: number): Promise<string>;
}

export class GeolocationLocationProvider implements LocationProvider {
  private readonly reverseGeocoder?: ReverseGeocoder;

  constructor(reverseGeocoder?: ReverseGeocoder) {
    this.reverseGeocoder = reverseGeocoder;
  }

  async getCurrentLocation(): Promise<Location> {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location permission',
            message: 'We use your location to show the weather where you are.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Location permission denied. Please enable location permissions in your device settings to use current location weather.');
        }
      }
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          let name = 'Current location';
          if (this.reverseGeocoder) {
            try {
              name = await this.reverseGeocoder.reverseGeocode(latitude, longitude);
              console.log('Reverse Geocode', name);

            } catch {
              // Keep default name if reverse geocoding fails
            }
          }

          resolve({
            latitude,
            longitude,
            name,
          });
        },
        (error) => {
          reject(new Error(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    });
  }
}
