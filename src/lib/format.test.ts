import { afterEach, describe, expect, it, vi } from 'vitest';
import { openWhatsApp, productShareUrl, shareWa } from './format';
import { PRODUCTS } from '../data/products';

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
  it('points to the static /p/<id>.html preview page when the product has a confirmed photo', () => {
    const onda = PRODUCTS.find((p) => p.id === 'p17')!; // tiene imgs
    expect(productShareUrl(onda)).toBe('https://stickos3d.com.ar/p/p17.html');
  });

  it('falls back to the plain ?p=<id> deep link when there is no photo to preview', () => {
    const sinFoto = PRODUCTS.find((p) => p.id === 'p2')!; // sin imgs, PRÓXIMAMENTE
    expect(productShareUrl(sinFoto)).toBe('https://stickos3d.com.ar/?p=p2');
  });
});

describe('openWhatsApp', () => {
  afterEach(() => vi.restoreAllMocks());

  function mockPointer(coarse: boolean) {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) => ({ matches: coarse && query === '(pointer: coarse)', media: query }) as MediaQueryList,
    );
  }

  it('desktop (mouse): opens a new tab', () => {
    mockPointer(false);
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    openWhatsApp('https://wa.me/1?text=hola');
    expect(open).toHaveBeenCalledWith('https://wa.me/1?text=hola', '_blank');
  });

  it('touch screen: navigates in the same tab instead of window.open (in-app browsers block it)', () => {
    mockPointer(true);
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    vi.spyOn(console, 'error').mockImplementation(() => {}); // jsdom: "navigation not implemented"
    openWhatsApp('https://wa.me/1?text=hola');
    expect(open).not.toHaveBeenCalled();
  });
});
