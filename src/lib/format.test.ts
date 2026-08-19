import { describe, expect, it } from 'vitest';
import { productShareUrl, shareWa } from './format';

describe('shareWa', () => {
  it('opens WhatsApp without a destination number, unlike wa()/waWeb()', () => {
    const url = shareWa('hola');
    expect(url).toBe('https://api.whatsapp.com/send?text=hola');
    expect(url).not.toContain('phone=');
  });

  it('url-encodes the message', () => {
    const url = shareWa('Mirá esto & eso');
    expect(url).toContain(encodeURIComponent('Mirá esto & eso'));
  });
});

describe('productShareUrl', () => {
  it('builds a deep link the app reads back via ?p=<id> on load', () => {
    expect(productShareUrl('p17')).toBe('https://stickos3d.com.ar/?p=p17');
  });
});
