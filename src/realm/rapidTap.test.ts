import { describe, expect, it } from 'vitest';
import { recordRapidTap } from './rapidTap';

describe('rapid tap discovery', () => {
  it('triggers on the fourth tap inside two seconds and resets the sequence', () => {
    const result = recordRapidTap([100, 500, 1200], 1999);

    expect(result.triggered).toBe(true);
    expect(result.timestamps).toEqual([]);
  });

  it('drops taps that are two seconds old or older', () => {
    const result = recordRapidTap([0, 400, 900], 2000);

    expect(result.triggered).toBe(false);
    expect(result.timestamps).toEqual([400, 900, 2000]);
  });
});
