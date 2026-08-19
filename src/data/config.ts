import type { Color, PrintJob, StockStatusKey } from './types';

/* ============================================================
   CONFIGURACIÓN — editá esto con sus datos reales
   ============================================================ */
export const CONFIG = {
  whatsapp: '5492915164996', // ← número con código de país, sin + ni espacios
  instagram: 'stickos3de',
  email: 'hola@stickos3d.com.ar', // ← mismo destino que el formulario de contacto
};

/* ============================================================
   COLORES DE FILAMENTO DISPONIBLES
   Agregá o sacá según el stock real de rollos que tengan.
   ============================================================ */
export const COLORS: Color[] = [
  { name: 'Negro', hex: '#2A2A2E' },
  { name: 'Blanco', hex: '#E8E6E0' },
  { name: 'Naranja', hex: '#FF5A1F' },
  { name: 'Azul', hex: '#3E6FD4' },
  { name: 'Verde', hex: '#5FBF8A' },
  { name: 'Gris', hex: '#8A8F98' },
];

/* ============================================================
   COLA DE IMPRESIÓN — "El taller, en vivo"
   Actualizá esto cuando cambien de trabajo. progress: 0 = en cola.
   ============================================================ */
export const PRINT_QUEUE: PrintJob[] = [
  { name: 'Lámpara de luna — pedido #041', progress: 64 },
  { name: 'Soportes de auriculares x3', progress: 0 },
  { name: 'Pieza a medida — soporte de router', progress: 0 },
];

/* ============================================================
   COTIZADOR — precios base por tamaño y multiplicadores.
   size usa la MISMA fórmula que el catálogo (gramos × 33 × 4), con los
   gramos típicos de cada tamaño: S≈30g, M≈120g, L≈280g, XL≈600g. Si cambia
   el precio del filamento, hay que mover estos cuatro y los de PRODUCTS
   juntos, o el cotizador y el catálogo empiezan a contradecirse.
   ============================================================ */
export const QUOTE = {
  size: { S: 4000, M: 15800, L: 37000, XL: 79200 } as const,
  mat: { PLA: 1, PLA_MATE: 1.35, PLA_SILK: 1.74, PETG: 1.25, TPU: 1.5 } as const,
  rangeLow: 0.85,
  rangeHigh: 1.25,
};

// Vocabulario de estado — reutilizado del badge tipo máquina de la cola de impresión.
export const STOCK_STATUS: Record<StockStatusKey, { label: string; cls: string }> = {
  extruyendo: { label: 'Extruyendo ahora', cls: 'b-orange' },
  listo: { label: 'Listo para retirar', cls: 'b-teal' },
  pedido: { label: 'Bajo pedido — 3 a 5 días', cls: 'b-grey' },
};
