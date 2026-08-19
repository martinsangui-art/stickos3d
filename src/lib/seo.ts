import { CONFIG } from '../data/config';
import { hasConfirmedPrice, PRODUCTS } from '../data/products';
import type { StockStatusKey } from '../data/types';

const SITE_URL = 'https://stickos3d.com.ar/';

// schema.org itemAvailability — "pedido" (bajo pedido, 3 a 5 días) es el
// caso real más frecuente del catálogo y no es ni InStock ni OutOfStock;
// MadeToOrder es la categoría correcta de schema.org para eso.
const AVAILABILITY: Record<StockStatusKey, string> = {
  listo: 'https://schema.org/InStock',
  extruyendo: 'https://schema.org/InStock',
  pedido: 'https://schema.org/MadeToOrder',
};

function localBusinessSchema() {
  // priceRange real, calculado sobre los productos con precio confirmado
  // (los mismos que muestran precio en vez de "PRÓXIMAMENTE" en el sitio) —
  // así nunca vuelve a quedar desactualizado como pasaba con el valor fijo
  // que había antes en el <head> estático.
  const pricedProducts = PRODUCTS.filter(hasConfirmedPrice);
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
  const pricedProducts = PRODUCTS.filter(hasConfirmedPrice);
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
        sku: p.id,
        category: p.cat,
        offers: {
          '@type': 'Offer',
          url: SITE_URL,
          priceCurrency: 'ARS',
          price: p.price,
          availability: AVAILABILITY[p.status],
          itemCondition: 'https://schema.org/NewCondition',
        },
      },
    })),
  };
}

export function generateStructuredData(): object[] {
  return [localBusinessSchema(), productListSchema()];
}
