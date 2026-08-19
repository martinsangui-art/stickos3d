/* Eventos de conversión de Meta Pixel — antes el sitio solo mandaba
   PageView (cableado directo en el <script> de index.html, eso sigue
   igual). Sin AddToCart/InitiateCheckout/Lead/Contact, Meta no tiene forma
   de optimizar campañas por conversión real ni armar públicos de
   retargeting basados en intención de compra — solo puede optimizar por
   "entró al sitio", que es la señal más débil posible.

   El pixel se carga por <script> en index.html (fbevents.js), no como
   paquete npm — mismo criterio que EmailJS en src/lib/email.ts. */
interface FbqFn {
  (command: 'track', event: string, params?: Record<string, unknown>): void;
  (command: 'trackCustom', event: string, params?: Record<string, unknown>): void;
  (command: 'init', pixelId: string): void;
}

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

// Eventos "estándar" de Meta (AddToCart, InitiateCheckout, Lead, Contact) —
// son los que Meta sabe usar para optimizar campañas y armar públicos.
export function trackPixel(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

// Eventos propios sin equivalente estándar (ej: "compartieron un producto")
// — Meta los guarda igual, pero no forman parte del set que usa para
// optimización automática de campañas.
export function trackCustomPixel(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', event, params);
}
