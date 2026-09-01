import { QUOTE } from '../data/config';

export type QuoteSize = keyof typeof QUOTE.size; // "S" | "M" | "L" | "XL"
export type QuoteMaterial = keyof typeof QUOTE.mat;

export interface QuoteInput {
  size: QuoteSize;
  mat: QuoteMaterial;
  cx: number;
  qty: number;
}

export interface QuoteResult {
  low: number | null;
  high: number | null;
  needsContact: boolean;
}

/* El XL no cotiza solo: en piezas grandes una suba de filamento pega fuerte en
   pesos absolutos, así que ese caso se ajusta a mano. S/M/L siguen dando precio
   instantáneo, que es el diferenciador de la marca.

   Extraído del calcQuote() original (acoplado al DOM) como función pura, para
   poder testearlo sin montar el formulario completo. */
export function computeQuote({ size, mat, cx, qty }: QuoteInput): QuoteResult {
  if (size === 'XL') {
    return { low: null, high: null, needsContact: true };
  }

  const safeQty = Math.max(1, qty || 1);
  const base = QUOTE.size[size] * QUOTE.mat[mat] * cx * safeQty;
  const low = Math.round((base * QUOTE.rangeLow) / 100) * 100;
  const high = Math.round((base * QUOTE.rangeHigh) / 100) * 100;
  return { low, high, needsContact: false };
}
