import { useEffect } from 'react';
import { generateStructuredData } from '../lib/seo';

/* Inyecta LocalBusiness + Product (por cada producto con precio confirmado)
   como <script type="application/ld+json"> en <head>, calculado en runtime
   desde la misma fuente que el catálogo (src/data/products.ts). Reemplaza
   el bloque estático que había antes en index.html — ese se podía
   desincronizar del catálogo real (pasó: quedó con priceRange viejo mucho
   después de subir productos más caros). Googlebot ejecuta JS antes de
   indexar, así que un <script> agregado acá se lee igual que uno estático. */
export function StructuredData() {
  useEffect(() => {
    const scripts = generateStructuredData().map((data) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
      return el;
    });
    return () => {
      scripts.forEach((el) => el.remove());
    };
  }, []);

  return null;
}
