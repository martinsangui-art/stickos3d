import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useIgModal } from './useIgModal';

const KEY = 'stickos_ig_modal_seen';

describe('useIgModal', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('first visit: stays hidden until triggerFromCart fires it', () => {
    const { result } = renderHook(() => useIgModal());
    expect(result.current.show).toBe(false);

    act(() => result.current.triggerFromCart());

    expect(result.current.show).toBe(true);
    expect(window.localStorage.getItem(KEY)).not.toBeNull();
  });

  it('triggerFromCart only shows it once — a second call is a no-op', () => {
    const { result } = renderHook(() => useIgModal());
    act(() => result.current.triggerFromCart());
    act(() => result.current.hide());
    expect(result.current.show).toBe(false);

    act(() => result.current.triggerFromCart());
    // Ya se disparó y se guardó en localStorage: no debería volver a mostrarse
    // dentro de la misma semana, ni siquiera llamando triggerFromCart de nuevo.
    expect(result.current.show).toBe(false);
  });

  it('does not re-arm if it was already shown less than a week ago', () => {
    window.localStorage.setItem(KEY, String(Date.now()));
    const { result } = renderHook(() => useIgModal());

    act(() => result.current.triggerFromCart());

    expect(result.current.show).toBe(false);
  });

  it('re-arms if the stored timestamp is older than a week', () => {
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(KEY, String(eightDaysAgo));
    const { result } = renderHook(() => useIgModal());

    act(() => result.current.triggerFromCart());

    expect(result.current.show).toBe(true);
  });

  it('hide() closes it without clearing the "seen" timestamp', () => {
    const { result } = renderHook(() => useIgModal());
    act(() => result.current.triggerFromCart());
    const storedAt = window.localStorage.getItem(KEY);

    act(() => result.current.hide());

    expect(result.current.show).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBe(storedAt);
  });
});
