import { useEffect, useRef, useState } from 'react';
import { COLORS } from '../data/config';
import { hasConfirmedPrice } from '../data/products';
import type { Color, Product } from '../data/types';
import { fmt, productShareUrl, shareWa, wa } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useSoundContext } from '../context/SoundContext';
import { trackCustomPixel } from '../lib/pixel';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef(0);

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

  const imgs = p?.imgs && p.imgs.length ? p.imgs : null;
  const slideCount = (imgs?.length ?? 0) + (p?.video ? 1 : 0);

  function slide(dir: number) {
    if (slideCount < 2) return;
    setIdx((i) => (i + dir + slideCount) % slideCount);
  }

  // Swipe táctil — mismo umbral (40px) y criterio que ya usa ProductCard
  // para su slider chico; acá faltaba, solo se podía navegar con las flechas.
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (slideCount < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) >= 40) setIdx((i) => (i + (dx < 0 ? 1 : -1) + slideCount) % slideCount);
  }

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
  }, [p, slideCount]);

  function handleClose() {
    // Si había un video sonando en el modal, no lo dejamos corriendo de
    // fondo al cerrar — mismo criterio que el corte del preview en hover.
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  }

  if (!p) {
    return <div className="product-modal" hidden />;
  }

  const confirmedPrice = hasConfirmedPrice(p);

  function handleAdd() {
    if (!p) return;
    addToCart(p.id, p.name, p.price, modalColor ?? COLORS[0]);
    handleClose();
  }

  function handleQuoteWa() {
    let msg = `¡Hola STICKOS 3D! Quiero pedir ${p!.name}`;
    if (modalColor) msg += ` en color ${modalColor.name}`;
    msg += '.';
    window.open(wa(msg), '_blank');
  }

  function handleShare() {
    const priceLine = confirmedPrice ? ` (${fmt(p!.price)})` : '';
    const msg = `Mirá ${p!.name}${priceLine} de STICKOS 3D 👇\n${productShareUrl(p!)}`;
    trackCustomPixel('ShareProduct', { content_ids: [p!.id] });
    window.open(shareWa(msg), '_blank');
  }

  return (
    <div className="product-modal">
      <div className="product-modal-backdrop" onClick={handleClose}></div>
      <div className="product-modal-content">
        <button type="button" className="product-modal-close" onClick={handleClose} aria-label="Cerrar">✕</button>
        <button type="button" className="product-modal-share" onClick={handleShare} aria-label="Compartir este producto por WhatsApp" title="Compartir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4M12 4 8 8M12 4l4 4" />
            <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
          </svg>
        </button>
        <div className="product-modal-gallery">
          <div className="tile-slider" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="tile-slider-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {imgs || p.video ? (
                <>
                  {imgs?.map((src) => <img key={src} className="tile-photo" src={src} alt={p.name} />)}
                  {/* Video completo (con controles y sonido) — a diferencia del preview
                      muted del hover en la card, acá se ve entero si el usuario quiere. */}
                  {p.video && <video ref={videoRef} className="tile-photo" src={p.video} controls playsInline />}
                </>
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
              {slideCount > 1 && Array.from({ length: slideCount }, (_, i) => (
                <span key={i} className={'tile-dot' + (i === idx ? ' active' : '')}></span>
              ))}
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
        </div>
        {/* Precio + acción principal van HERMANOS de .product-modal-info, no
            adentro — así quedan fuera del contenedor que scrollea
            (.product-modal-info tiene overflow-y:auto en mobile) y la franja
            de precio+"A la cola" queda fija abajo del todo, sin que un
            scroll interno se la lleve puesta. Antes vivía anidado adentro de
            .product-modal-info: el CSS (grid-area/flex-shrink) asumía que
            era hermano, pero en el DOM real era hijo — por eso "A la cola"
            terminaba scrolleado fuera de vista pasara lo que pasara con el
            layout de afuera. */}
        <div className="product-modal-cta">
          <div className="product-modal-price" style={{ color: confirmedPrice ? '' : 'var(--muted)' }}>
            {confirmedPrice ? `$ ${p.price.toLocaleString('es-AR')}` : 'PRÓXIMAMENTE'}
          </div>
          <div className="product-modal-cta-buttons">
            {confirmedPrice ? (
              <button type="button" className="btn btn-primary" onClick={handleAdd}>A la cola</button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleClose();
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
