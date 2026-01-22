import { parseLocationInput } from '../../src/presentation/validation/locationInputValidator';

describe('parseLocationInput', () => {
  it('returns error when empty', () => {
    const result = parseLocationInput('   ');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Location is required');
    }
  });

  it('returns error when not in lat,lon format', () => {
    const result = parseLocationInput('Berlin');

    expect(result.ok).toBe(false);
  });

  it('parses valid coordinates', () => {
    const result = parseLocationInput('52.52,13.41');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.location.latitude).toBeCloseTo(52.52);
      expect(result.location.longitude).toBeCloseTo(13.41);
      expect(result.location.name).toBe('52.52,13.41');
    }
  });
});
