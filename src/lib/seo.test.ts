import { describe, expect, it } from 'vitest';
import { generateStructuredData } from './seo';
import { hasConfirmedPrice, PRODUCTS } from '../data/products';

describe('generateStructuredData', () => {
  const [localBusiness, productList] = generateStructuredData() as [
    { priceRange: string },
    { itemListElement: { item: { offers: { price: number } } }[] },
  ];

  it('computes priceRange from the real min/max of priced products, not a hardcoded value', () => {
    const pricedProducts = PRODUCTS.filter(hasConfirmedPrice);
    const min = Math.min(...pricedProducts.map((p) => p.price));
    const max = Math.max(...pricedProducts.map((p) => p.price));
    expect(localBusiness.priceRange).toBe(`$${min.toLocaleString('es-AR')} - $${max.toLocaleString('es-AR')}`);
  });

  it('only lists products the site actually shows a price for (imgs confirmed)', () => {
    const expectedCount = PRODUCTS.filter(hasConfirmedPrice).length;
    expect(productList.itemListElement).toHaveLength(expectedCount);
  });

  it('never lists a product that is shown as PRÓXIMAMENTE on the site', () => {
    const listedSkus = new Set(
      (generateStructuredData()[1] as { itemListElement: { item: { sku: string } }[] }).itemListElement.map(
        (e) => e.item.sku,
      ),
    );
    const unpriced = PRODUCTS.filter((p) => !hasConfirmedPrice(p));
    for (const p of unpriced) {
      expect(listedSkus.has(p.id)).toBe(false);
    }
  });
});
