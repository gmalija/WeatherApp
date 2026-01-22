import type { Location } from '../../domain/entities/Location';

export type LocationValidationResult =
  | { ok: true; location: Location }
  | { ok: false; error: string };

export function parseLocationInput(rawValue: string): LocationValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, error: 'Location is required' };
  }

  const latLonRegex = /^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/;

  if (!latLonRegex.test(value)) {
    return {
      ok: false,
      error: 'Enter coordinates as "lat,lon" (for example 52.52,13.41)',
    };
  }

  const [latPart, lonPart] = value.split(',');
  const latitude = Number(latPart);
  const longitude = Number(lonPart);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return { ok: false, error: 'Latitude and longitude must be numbers' };
  }

  if (latitude < -90 || latitude > 90) {
    return { ok: false, error: 'Latitude must be between -90 and 90' };
  }

  if (longitude < -180 || longitude > 180) {
    return { ok: false, error: 'Longitude must be between -180 and 180' };
  }

  const location: Location = {
    latitude,
    longitude,
    name: value,
  };

  return { ok: true, location };
}
