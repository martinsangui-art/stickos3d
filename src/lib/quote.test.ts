import { describe, expect, it } from 'vitest';
import { computeQuote } from './quote';

describe('computeQuote', () => {
  it('matches the default form selection (M / PLA / complejidad media / qty 1)', () => {
    // Mismos defaults que el <select> del cotizador: tamaño M, material PLA,
    // complejidad "Media/no sé" (1.3), cantidad 1. Precios base recalculados
    // con el costo de filamento actualizado (commit 884eb42 en main).
    const result = computeQuote({ size: 'M', mat: 'PLA', cx: 1.3, qty: 1 });
    expect(result.needsContact).toBe(false);
    expect(result.low).toBe(22900);
    expect(result.high).toBe(33600);
  });

  it('scales linearly with quantity', () => {
    const one = computeQuote({ size: 'S', mat: 'PLA', cx: 1, qty: 1 });
    const three = computeQuote({ size: 'S', mat: 'PLA', cx: 1, qty: 3 });
    expect(three.low).toBe((one.low ?? 0) * 3);
    expect(three.high).toBe((one.high ?? 0) * 3);
  });

  it('applies the material multiplier (PETG costs more than PLA)', () => {
    const pla = computeQuote({ size: 'L', mat: 'PLA', cx: 1, qty: 1 });
    const petg = computeQuote({ size: 'L', mat: 'PETG', cx: 1, qty: 1 });
    expect(petg.low! > pla.low!).toBe(true);
    expect(petg.high! > pla.high!).toBe(true);
  });

  it('XL always needs manual contact instead of an instant price', () => {
    const result = computeQuote({ size: 'XL', mat: 'PLA', cx: 1, qty: 1 });
    expect(result.needsContact).toBe(true);
    expect(result.low).toBeNull();
    expect(result.high).toBeNull();
  });

  it('treats a non-positive quantity as 1 (matches the original || 1 fallback)', () => {
    const zero = computeQuote({ size: 'S', mat: 'PLA', cx: 1, qty: 0 });
    const one = computeQuote({ size: 'S', mat: 'PLA', cx: 1, qty: 1 });
    expect(zero.low).toBe(one.low);
    expect(zero.high).toBe(one.high);
  });
});
