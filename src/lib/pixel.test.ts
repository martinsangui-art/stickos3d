import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackPixel } from './pixel';

describe('trackPixel', () => {
  afterEach(() => {
    delete window.fbq;
  });

  it('calls window.fbq("track", event, params) when the pixel is loaded', () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    trackPixel('AddToCart', { value: 3500, currency: 'ARS' });

    expect(fbq).toHaveBeenCalledWith('track', 'AddToCart', { value: 3500, currency: 'ARS' });
  });

  it('does nothing (no throw) when the pixel script never loaded — e.g. blocked by an ad blocker', () => {
    expect(() => trackPixel('Lead')).not.toThrow();
  });
});
