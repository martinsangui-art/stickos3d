import { CONFIG } from '../data/config';
import { VISIBLE_PRODUCTS } from '../data/products';
import type { StockStatusKey } from '../data/types';

const SITE_URL = 'https://stickos3d.com.ar/';

// schema.org itemAvailability — "pedido" (bajo pedido, 3 a 5 días) es el
// caso real más frecuente del catálogo y no es ni InStock ni OutOfStock.
// MadeToOrder es válido en schema.org, pero NO está en la lista de valores
// que Google acepta para listados de Merchant/Product — Search Console lo
// marca como "valor de enumeración no válido". BackOrder es el que Google
// sí reconoce para este caso (disponible, se produce/despacha después).
const AVAILABILITY: Record<StockStatusKey, string> = {
  listo: 'https://schema.org/InStock',
  extruyendo: 'https://schema.org/InStock',
  pedido: 'https://schema.org/BackOrder',
};

// Días de armado antes de despachar, por status — coincide con el badge
// STOCK_STATUS que ya se muestra en el sitio. Usado en handlingTime del
// structured data de envío (punto 5 más abajo).
const HANDLING_DAYS: Record<StockStatusKey, [number, number]> = {
  listo: [0, 1],
  extruyendo: [1, 3],
  pedido: [3, 5],
};

// Política de devoluciones real: piezas hechas a medida están exceptuadas
// del derecho de arrepentimiento de 10 días (art. 1116 CCCN) — por eso
// NotPermitted, no un plazo. La garantía legal por defectos de fabricación
// (art. 11 Ley 24.240, piso de 6 meses, no acortable) es un derecho aparte
// que no tiene campo propio en schema.org para "solo defectos" — queda en
// el texto visible del sitio (Footer), igual que Etsy/Amazon Handmade con
// ítems personalizados. No declarar acá un plazo de devolución genérico.
const RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
  applicableCountry: 'AR',
};

// Detalle de envío por Offer: tarifa (rango real de correo a todo el país),
// destino (Argentina) y tiempo total = armado (handlingTime, según status)
// + tránsito del correo (transitTime, fijo).
function shippingDetails(status: StockStatusKey) {
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', currency: 'ARS', minValue: 14000, maxValue: 20000 },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'AR' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: HANDLING_DAYS[status][0],
        maxValue: HANDLING_DAYS[status][1],
        unitCode: 'DAY',
      },
      transitTime: { '@type': 'QuantitativeValue', minValue: 7, maxValue: 7, unitCode: 'DAY' },
    },
  };
}

function localBusinessSchema() {
  // priceRange real, calculado sobre los productos con precio confirmado
  // (los mismos que muestran precio en vez de "PRÓXIMAMENTE" en el sitio) —
  // así nunca vuelve a quedar desactualizado como pasaba con el valor fijo
  // que había antes en el <head> estático.
  const pricedProducts = VISIBLE_PRODUCTS;
  const prices = pricedProducts.map((p) => p.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'STICKOS 3D',
    url: SITE_URL,
    image: `${SITE_URL}assets/og-image.png`,
    description:
      'Impresión 3D en Bahía Blanca: diseños propios y piezas a pedido con cotización instantánea. Retiro local y envíos a todo el país.',
    telephone: `+${CONFIG.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bahía Blanca',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    sameAs: [`https://instagram.com/${CONFIG.instagram}`],
    priceRange: `$${min.toLocaleString('es-AR')} - $${max.toLocaleString('es-AR')}`,
  };
}

// Solo los productos con precio confirmado (imgs reales cargadas) entran al
// schema — son los únicos que el sitio mismo muestra con precio en vez de
// "PRÓXIMAMENTE", así el structured data nunca promete un precio que la
// página no muestra.
function productListSchema() {
  const pricedProducts = VISIBLE_PRODUCTS;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: pricedProducts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.desc,
        image: p.imgs!.map((src) => `${SITE_URL}${src.replace(/^\//, '')}`),
        url: `${SITE_URL}p/${p.id}.html`,
        sku: p.id,
        category: p.cat,
        brand: { '@type': 'Brand', name: 'STICKOS 3D' },
        offers: {
          '@type': 'Offer',
          url: SITE_URL,
          priceCurrency: 'ARS',
          price: p.price,
          availability: AVAILABILITY[p.status],
          itemCondition: 'https://schema.org/NewCondition',
          hasMerchantReturnPolicy: RETURN_POLICY,
          shippingDetails: shippingDetails(p.status),
        },
      },
    })),
  };
}

export function generateStructuredData(): object[] {
  return [localBusinessSchema(), productListSchema()];
}
