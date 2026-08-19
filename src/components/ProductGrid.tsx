import { useMemo, useRef, useState } from 'react';
import { COLORS } from '../data/config';
import { PRODUCTS } from '../data/products';
import type { Color } from '../data/types';
import { useReveal } from '../hooks/useReveal';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';

const CATS = ['Todos', ...Array.from(new Set(PRODUCTS.map((p) => p.cat)))];

export function ProductGrid() {
  const headReveal = useReveal<HTMLDivElement>();
  const [activeCat, setActiveCat] = useState('Todos');
  const [selectedColor, setSelectedColor] = useState<Record<string, Color>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, COLORS[0]])),
  );
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  // Solo la primera vez que se pinta el grid entero se anima con reveal/stagger,
  // igual que firstProductRender en el original — cambiar de filtro después no
  // vuelve a animar las cards, aparecen directo.
  const hasRenderedOnce = useRef(false);
  const isFirstRender = !hasRenderedOnce.current;
  hasRenderedOnce.current = true;

  const list = useMemo(() => {
    const filtered = activeCat === 'Todos' ? PRODUCTS.slice() : PRODUCTS.filter((p) => p.cat === activeCat);
    // Con foto real primero — sort() es estable en JS, así que entre
    // empatados se conserva el orden original de PRODUCTS.
    return filtered.sort((a, b) => {
      const aHasPhoto = a.imgs && a.imgs.length ? 1 : 0;
      const bHasPhoto = b.imgs && b.imgs.length ? 1 : 0;
      return bHasPhoto - aHasPhoto;
    });
  }, [activeCat]);

  const openProduct = openProductId ? PRODUCTS.find((p) => p.id === openProductId) ?? null : null;

  return (
    <section id="catalogo">
      <div className="wrap">
        <div className={`sec-head ${headReveal.className}`} ref={headReveal.ref}>
          <div>
            <div className="eyebrow">Capa 01 — Catálogo</div>
            <h2 className="sec-title">Diseños listos para pedir</h2>
            <p>Tocá un color y mirá cómo queda. Cada pieza se imprime al momento del pedido, en el color que elijas.</p>
          </div>
        </div>
        <div className="filters" role="tablist" aria-label="Filtrar por categoría">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              className={'chip' + (c === activeCat ? ' active' : '')}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid">
          {list.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              selectedColor={selectedColor[p.id]}
              onColorChange={(c) => setSelectedColor((s) => ({ ...s, [p.id]: c }))}
              onOpenModal={() => setOpenProductId(p.id)}
              revealDelayMs={isFirstRender ? (i % 4) * 70 : null}
            />
          ))}
        </div>
      </div>
      <ProductModal product={openProduct} onClose={() => setOpenProductId(null)} />
    </section>
  );
}
