import { useEffect, useState } from 'react';
import { COLORS } from '../data/config';
import { hasConfirmedPrice } from '../data/products';
import type { Color, Product } from '../data/types';
import { wa } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useSoundContext } from '../context/SoundContext';

interface Props {
  product: Product | null;
  onClose: () => void;
}

/* Modal de detalle de producto — se abre al tocar la foto/tile de una card,
   reusa el mismo slider visual que ProductCard, en tamaño grande.

   modalColor es estado propio del modal (para el botón "Cotizar por
   WhatsApp"), separado del selectedColor de las cards/carrito — igual que en
   el original: abrir el modal siempre arranca en "sin color elegido". */
export function ProductModal({ product: p, onClose }: Props) {
  const { addToCart } = useCart();
  const { playBlip } = useSoundContext();
  const [idx, setIdx] = useState(0);
  const [modalColor, setModalColor] = useState<Color | null>(null);

  // Reset al abrir un producto nuevo.
  useEffect(() => {
    setIdx(0);
    setModalColor(null);
  }, [p?.id]);

  useEffect(() => {
    document.body.style.overflow = p ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [p]);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (!p) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') slide(-1);
      if (e.key === 'ArrowRight') slide(1);
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  if (!p) {
    return <div className="product-modal" hidden />;
  }

  const imgs = p.imgs && p.imgs.length ? p.imgs : null;
  const confirmedPrice = hasConfirmedPrice(p);

  function slide(dir: number) {
    if (!imgs || imgs.length < 2) return;
    setIdx((i) => (i + dir + imgs.length) % imgs.length);
  }

  function handleAdd() {
    if (!p) return;
    addToCart(p.id, p.name, p.price, modalColor ?? COLORS[0]);
    onClose();
  }

  function handleQuoteWa() {
    let msg = `¡Hola STICKOS 3D! Quiero pedir ${p!.name}`;
    if (modalColor) msg += ` en color ${modalColor.name}`;
    msg += '.';
    window.open(wa(msg), '_blank');
  }

  return (
    <div className="product-modal">
      <div className="product-modal-backdrop" onClick={onClose}></div>
      <div className="product-modal-content">
        <button type="button" className="product-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="product-modal-gallery">
          <div className="tile-slider">
            <div className="tile-slider-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {imgs ? (
                imgs.map((src) => <img key={src} className="tile-photo" src={src} alt={p.name} />)
              ) : (
                <div
                  className="obj"
                  style={{ '--obj': 'var(--accent)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' } as React.CSSProperties}
                >
                  {p.name.charAt(0)}
                </div>
              )}
            </div>
            <button type="button" className="tile-nav prev" aria-label="Foto anterior" onClick={() => slide(-1)}>‹</button>
            <button type="button" className="tile-nav next" aria-label="Foto siguiente" onClick={() => slide(1)}>›</button>
            <div className="tile-dots">
              {imgs && imgs.length > 1 && imgs.map((_, i) => <span key={i} className={'tile-dot' + (i === idx ? ' active' : '')}></span>)}
            </div>
          </div>
        </div>
        <div className="product-modal-info">
          <div className="eyebrow">{p.cat} · {p.mat}</div>
          <h3>{p.name}</h3>
          <div className="swatches" role="group" aria-label="Elegir color">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                className={'swatch' + (modalColor?.name === c.name ? ' active' : '')}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={`Color ${c.name}`}
                onClick={() => {
                  setModalColor(c);
                  playBlip(700);
                }}
              />
            ))}
            <span className="swatch-label">{modalColor ? modalColor.name : 'Elegí un color'}</span>
          </div>
          <p className="product-modal-desc">{p.desc || ''}</p>
          <p className="product-modal-mat">{p.mat}</p>
          <div className="product-modal-price" style={{ color: confirmedPrice ? '' : 'var(--muted)' }}>
            {confirmedPrice ? `$ ${p.price.toLocaleString('es-AR')}` : 'PRÓXIMAMENTE'}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {confirmedPrice ? (
              <button type="button" className="btn btn-primary" onClick={handleAdd}>A la cola</button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Consultar
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={handleQuoteWa}>Cotizar por WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
