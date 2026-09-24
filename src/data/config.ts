import type { Color, StockStatusKey } from './types';

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
   COTIZADOR — piso de precio por tamaño. Es "desde cuánto arranca" ese
   tipo de pieza, no un cálculo: no multiplica por acabado, complejidad ni
   cantidad. El precio final se confirma por WhatsApp viendo el modelo.
   Decisión de negocio de Martín (23/09/2026), no sale de la fórmula ×5.74.
   ============================================================ */
export const QUOTE_FLOOR = { chico: 12000, mediano: 25000, grande: 45000 } as const;

// Vocabulario de estado — reutilizado del badge tipo máquina de la cola de impresión.
export const STOCK_STATUS: Record<StockStatusKey, { label: string; cls: string }> = {
  extruyendo: { label: 'Extruyendo ahora', cls: 'b-orange' },
  listo: { label: 'Listo para retirar', cls: 'b-teal' },
  pedido: { label: 'Bajo pedido — 3 a 5 días', cls: 'b-grey' },
};
