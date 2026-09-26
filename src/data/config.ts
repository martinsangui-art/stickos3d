import type { Color, StockStatusKey } from './types';

/* ============================================================
   CONFIGURACIÓN — editá esto con sus datos reales
   ============================================================ */
export const CONFIG = {
  whatsapp: '5492915164996', // ← número con código de país, sin + ni espacios
  instagram: 'stickos3de',
  email: 'hola@stickos3d.com.ar', // ← mismo destino que el formulario de contacto
};


/* El color no se elige en la web: se coordina por WhatsApp. Esto es lo que
   muestra el carrito en cada ítem. */
export const COLOR_TBD: Color = { name: 'A coordinar', hex: '#8C8579' };

/* ============================================================
   COTIZADOR — piso de precio por tamaño. Es "desde cuánto arranca" ese
   tipo de pieza, no un cálculo: no multiplica por acabado, complejidad ni
   cantidad. El precio final se confirma por WhatsApp viendo el modelo.
   Decisión de negocio de Martín (23/09/2026), no sale de la fórmula ×5.74.
   ============================================================ */
export const QUOTE_FLOOR = { chico: 12000, mediano: 25000, grande: 45000 } as const;

// Vocabulario de estado — reutilizado del badge tipo máquina de la cola de impresión.
// `short` es la versión para la grilla de 2 columnas en mobile, donde la
// card mide ~170px y la etiqueta larga no entra en una línea.
export const STOCK_STATUS: Record<StockStatusKey, { label: string; short: string; cls: string }> = {
  extruyendo: { label: 'Extruyendo ahora', short: 'Imprimiendo', cls: 'b-orange' },
  listo: { label: 'Listo para retirar', short: 'Listo', cls: 'b-teal' },
  pedido: { label: 'Bajo pedido — 3 a 5 días', short: '3 a 5 días', cls: 'b-grey' },
};
