import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIgModal } from './useIgModal';

const KEY = 'stickos_ig_modal_seen';

// jsdom no tiene layout: se simula una página de 2000px con 1000px de viewport.
function scrollTo(top: number) {
  const doc = document.documentElement;
  Object.defineProperty(doc, 'scrollHeight', { configurable: true, value: 2000 });
  Object.defineProperty(doc, 'clientHeight', { configurable: true, value: 1000 });
  doc.scrollTop = top;
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('useIgModal', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.innerHTML = '';
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('first visit: stays hidden until the scroll passes 50 %', () => {
    const { result } = renderHook(() => useIgModal());
    scrollTo(400); // 40 %
    expect(result.current.show).toBe(false);

    scrollTo(600); // 60 %
    expect(result.current.show).toBe(true);
    expect(window.localStorage.getItem(KEY)).not.toBeNull();
  });

  it('never shows while the cart or a product modal is open, and shows once they are closed', () => {
    const drawer = document.createElement('aside');
    drawer.className = 'drawer open';
    document.body.appendChild(drawer);
    const { result } = renderHook(() => useIgModal());

    scrollTo(700);
    expect(result.current.show).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBeNull(); // no gasta la vez de la semana

    drawer.className = 'drawer';
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    document.body.appendChild(modal);
    scrollTo(750);
    expect(result.current.show).toBe(false);

    modal.hidden = true;
    scrollTo(800);
    expect(result.current.show).toBe(true);
  });

  it('does not re-arm if it was already shown less than a week ago', () => {
    window.localStorage.setItem(KEY, String(Date.now()));
    const { result } = renderHook(() => useIgModal());
    scrollTo(900);
    expect(result.current.show).toBe(false);
  });

  it('re-arms if the stored timestamp is older than a week', () => {
    window.localStorage.setItem(KEY, String(Date.now() - 8 * 24 * 60 * 60 * 1000));
    const { result } = renderHook(() => useIgModal());
    scrollTo(900);
    expect(result.current.show).toBe(true);
  });

  it('hide() closes it without clearing the "seen" timestamp', () => {
    const { result } = renderHook(() => useIgModal());
    scrollTo(900);
    const storedAt = window.localStorage.getItem(KEY);
    act(() => result.current.hide());
    expect(result.current.show).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBe(storedAt);
  });

  it('works with blocked storage (private mode): shows without throwing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useIgModal());
    scrollTo(900);
    expect(result.current.show).toBe(true);
  });
});
