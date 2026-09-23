import { QUOTE_FLOOR } from '../data/config';

export type QuoteSize = keyof typeof QUOTE_FLOOR | 'no_se';
export type QuoteFinish = 'mate' | 'brillante' | 'seda' | 'indistinto';
export type QuoteDelivery = 'retiro' | 'envio';
export type QuoteWhen = 'sin_apuro' | 'dos_semanas' | 'fecha';
export type QuoteFile = 'si' | 'no';

// Referencias de objetos cotidianos en vez de centímetros: el cliente no
// sabe medir lo que imagina, y elegir "5–12 cm" terminaba en piezas de 15.
export const SIZE_OPTIONS: [QuoteSize, string][] = [
  ['chico', 'Chico — como una taza'],
  ['mediano', 'Mediano — como una pelota de handball'],
  ['grande', 'Grande — como un balde'],
  ['no_se', 'No estoy seguro, ayudame vos'],
];
export const FINISH_OPTIONS: [QuoteFinish, string][] = [
  ['mate', 'Mate, sin brillo'],
  ['brillante', 'Brillante'],
  ['seda', 'Con brillo símil seda'],
  ['indistinto', 'Me da igual / recomendame'],
];
export const DELIVERY_OPTIONS: [QuoteDelivery, string][] = [
  ['retiro', 'Retiro en Bahía Blanca'],
  ['envio', 'Envío a domicilio'],
];
export const WHEN_OPTIONS: [QuoteWhen, string][] = [
  ['sin_apuro', 'Sin apuro'],
  ['dos_semanas', 'Dentro de dos semanas'],
  ['fecha', 'Tengo fecha'],
];
export const FILE_OPTIONS: [QuoteFile, string][] = [
  ['si', 'Sí, lo tengo'],
  ['no', 'No, lo busco con ustedes'],
];

/* Piso de precio: depende solo del tamaño. null = "no estoy seguro", que no
   muestra monto (se pasa el precio por WhatsApp). */
export function quoteFloor(size: QuoteSize): number | null {
  return size === 'no_se' ? null : QUOTE_FLOOR[size];
}

export interface QuoteRequest {
  name: string;
  desc: string;
  size: QuoteSize;
  finish: QuoteFinish;
  qty: number;
  delivery: QuoteDelivery;
  place: string;
  when: QuoteWhen;
  date: string;
  file: QuoteFile;
}

const label = <T extends string>(opts: [T, string][], v: T) => opts.find(([k]) => k === v)![1];

/* Mensaje de WhatsApp: sin emojis y sin estimado — el número lo da Martín
   después de ver el modelo, no el formulario. */
export function buildQuoteMessage(r: QuoteRequest): string {
  const place = r.place.trim();
  const delivery = r.delivery === 'retiro'
    ? 'retiro en Bahía Blanca'
    : place ? `envío a ${place}` : 'envío a domicilio';
  const when = r.when === 'fecha' ? r.date.trim() : label(WHEN_OPTIONS, r.when).toLowerCase();
  const file = r.file === 'si' ? 'lo tengo' : 'lo busco con ustedes';
  return (
    `Hola STICKOS 3D, soy ${r.name.trim()} y usé el cotizador de la web.\n\n` +
    `Pieza: ${r.desc.trim()}\n` +
    `Tamaño: ${label(SIZE_OPTIONS, r.size)}\n` +
    `Acabado: ${label(FINISH_OPTIONS, r.finish)}\n` +
    `Cantidad: ${Math.max(1, r.qty || 1)}\n` +
    `Entrega: ${delivery}\n` +
    `Lo necesito: ${when}\n` +
    `Archivo: ${file}`
  );
}
