import { describe, expect, it } from 'vitest';
import { buildQuoteMessage, quoteFloor, type QuoteRequest } from './quote';

describe('quoteFloor', () => {
  it('returns the floor price for each size', () => {
    expect(quoteFloor('chico')).toBe(12000);
    expect(quoteFloor('mediano')).toBe(25000);
    expect(quoteFloor('grande')).toBe(45000);
  });

  it('returns null when the customer is not sure about the size', () => {
    expect(quoteFloor('no_se')).toBeNull();
  });
});

describe('buildQuoteMessage', () => {
  const base: QuoteRequest = {
    name: 'Lucía',
    desc: 'Portalápices tipo pulpo',
    size: 'mediano',
    finish: 'mate',
    qty: 2,
    delivery: 'retiro',
    place: '',
    when: 'sin_apuro',
    date: '',
    file: 'no',
  };

  it('builds the full message with the agreed format', () => {
    expect(buildQuoteMessage(base)).toBe(
      'Hola STICKOS 3D, soy Lucía y usé el cotizador de la web.\n\n' +
        'Pieza: Portalápices tipo pulpo\n' +
        'Tamaño: Mediano — como una pelota de handball\n' +
        'Acabado: Mate, sin brillo\n' +
        'Cantidad: 2\n' +
        'Entrega: retiro en Bahía Blanca\n' +
        'Lo necesito: sin apuro\n' +
        'Archivo: lo busco con ustedes',
    );
  });

  it('uses the typed place for shipping, or a generic line if left empty', () => {
    expect(buildQuoteMessage({ ...base, delivery: 'envio', place: ' Tandil, 7000 ' }))
      .toContain('Entrega: envío a Tandil, 7000\n');
    expect(buildQuoteMessage({ ...base, delivery: 'envio', place: '' }))
      .toContain('Entrega: envío a domicilio\n');
  });

  it('uses the typed date when the customer has one', () => {
    expect(buildQuoteMessage({ ...base, when: 'fecha', date: 'el 15 de octubre' }))
      .toContain('Lo necesito: el 15 de octubre\n');
    expect(buildQuoteMessage({ ...base, when: 'dos_semanas' }))
      .toContain('Lo necesito: dentro de dos semanas\n');
  });

  it('has no emojis and no price estimate', () => {
    const msg = buildQuoteMessage({ ...base, file: 'si' });
    expect(msg).toContain('Archivo: lo tengo');
    expect(msg).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(msg).not.toContain('$');
    expect(msg.toLowerCase()).not.toContain('estimado');
  });
});
