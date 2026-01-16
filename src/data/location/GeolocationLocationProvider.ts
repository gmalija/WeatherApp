import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

import type { Location } from '../../domain/entities/Location';
import type { LocationProvider } from '../../domain/location/LocationProvider';

export class GeolocationLocationProvider implements LocationProvider {
  async getCurrentLocation(): Promise<Location> {
    if (Platform.OS === 'android') {
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
        throw new Error('Location permission was not granted');
      }
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          resolve({
            latitude,
            longitude,
            name: 'Current location',
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
