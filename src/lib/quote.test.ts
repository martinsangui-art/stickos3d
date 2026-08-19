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

  it('scales with quantity (base price × qty, before rounding to the nearest 100)', () => {
    // No comparamos contra qty=1 × 3: redondear a la centena en cada punto
    // no siempre da exactamente 3x (ver S actual: 4400×3=13200 pero el
    // cálculo real redondeado da 13300) — se verifica el valor real contra
    // la fórmula, no una proporción asumida.
    const one = computeQuote({ size: 'S', mat: 'PLA', cx: 1, qty: 1 });
    const three = computeQuote({ size: 'S', mat: 'PLA', cx: 1, qty: 3 });
    expect(one.low).not.toBeNull();
    expect(three.low! > one.low!).toBe(true);
    expect(three.high! > one.high!).toBe(true);
    // El precio por unidad implícito tiene que quedar cerca de 3x, dentro
    // del margen que puede meter un redondeo a centena por punto.
    expect(Math.abs(three.low! - one.low! * 3)).toBeLessThanOrEqual(100);
    expect(Math.abs(three.high! - one.high! * 3)).toBeLessThanOrEqual(100);
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
