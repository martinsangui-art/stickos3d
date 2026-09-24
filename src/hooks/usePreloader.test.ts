import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { usePreloader } from './usePreloader';

const KEY = 'stk_preloader_seen';

describe('usePreloader', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('first visit of the session: shows it and marks the session as seen', () => {
    const { result } = renderHook(() => usePreloader());
    expect(result.current.done).toBe(false);
    expect(window.sessionStorage.getItem(KEY)).not.toBeNull();
  });

  it('already seen in this session: skips it', () => {
    window.sessionStorage.setItem(KEY, '1');
    const { result } = renderHook(() => usePreloader());
    expect(result.current.done).toBe(true);
  });

  it('shared product link (?p=): never shows it', () => {
    window.history.replaceState(null, '', '/?p=p21');
    const { result } = renderHook(() => usePreloader());
    expect(result.current.done).toBe(true);
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });
});
