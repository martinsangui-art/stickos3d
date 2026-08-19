import { useRef, useState } from 'react';
import type { Color } from '../data/types';
import type { Product } from '../data/types';
import { COLORS, STOCK_STATUS } from '../data/config';
import { fmt } from '../lib/format';
import { hasConfirmedPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSoundContext } from '../context/SoundContext';

interface Props {
  product: Product;
  selectedColor: Color;
  onColorChange: (color: Color) => void;
  onOpenModal: () => void;
  revealDelayMs: number | null; // null = no aparece con fade-in (re-render por filtro)
}

export function ProductCard({ product: p, selectedColor, onColorChange, onOpenModal, revealDelayMs }: Props) {
  const { addToCart } = useCart();
  const { notify } = useToast();
  const { playBlip } = useSoundContext();
  const [idx, setIdx] = useState(0);
  const [pulse, setPulse] = useState(false);
  const touchStartX = useRef(0);

  const imgs = p.imgs && p.imgs.length ? p.imgs.slice(0, 4) : null;
  const confirmedPrice = hasConfirmedPrice(p);
  const status = STOCK_STATUS[p.status];

  function slide(dir: number, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!imgs) return;
    setIdx((i) => (i + dir + imgs.length) % imgs.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!imgs || imgs.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) >= 40) setIdx((i) => (i + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length);
  }

  function handleAdd() {
    if (!confirmedPrice) return;
    addToCart(p.id, p.name, p.price, selectedColor);
    playBlip(480);
    notify(`${p.name} (${selectedColor.name}) en cola ✓`);
    setPulse(false);
    // reinicia la animación .pulse en cada click, como el void offsetWidth original
    requestAnimationFrame(() => setPulse(true));
  }

  const cardClass = 'card' + (revealDelayMs !== null ? ' reveal' : '');
  const cardStyle: React.CSSProperties & Record<string, string> = { '--filament': selectedColor.hex };
  if (revealDelayMs !== null) cardStyle.transitionDelay = `${revealDelayMs}ms`;

  return (
    <article className={cardClass} data-card={p.id} style={cardStyle}>
      <div className="card-top"></div>
      <div className={'tile' + (imgs ? ' has-photo' : '')} data-idx={idx} onClick={onOpenModal}>
        <div className="tick tl"></div>
        <div className="tick tr"></div>
        <div className="tick bl"></div>
        <div className="tick br"></div>
        {imgs ? (
          <div className="tile-slider" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="tile-slider-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {imgs.map((src) => (
                <img key={src} className="tile-photo" src={src} alt={p.name} loading="lazy" />
              ))}
            </div>
            {imgs.length > 1 && (
              <>
                <button type="button" className="tile-nav prev" aria-label="Foto anterior" onClick={(e) => slide(-1, e)}>‹</button>
                <button type="button" className="tile-nav next" aria-label="Foto siguiente" onClick={(e) => slide(1, e)}>›</button>
                <div className="tile-dots">
                  {imgs.map((_, i) => (
                    <span key={i} className={'tile-dot' + (i === idx ? ' active' : '')}></span>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="obj" style={{ '--obj': selectedColor.hex } as React.CSSProperties}>
            <span>{p.name.charAt(0)}</span>
          </div>
        )}
        <div className="card-status">
          <span className={`badge ${status.cls}`}>
            <span className="dot"></span>
            {status.label}
          </span>
        </div>
        <div className="sweep"></div>
      </div>
      <div className="card-body">
        <div className="card-cat">{p.cat} · {p.mat}</div>
        <h3>{p.name}</h3>
        <div className="swatches" role="group" aria-label="Elegir color">
          {/* COLORS viene por contexto implícito de quien nos pasó selectedColor;
              el color set completo se resuelve arriba en ProductGrid. */}
          <ColorSwatches selected={selectedColor} onChange={(c) => { onColorChange(c); playBlip(700); }} />
          <span className="swatch-label">{selectedColor.name}</span>
        </div>
        <div className="card-foot">
          {confirmedPrice ? (
            <span className="price">{fmt(p.price)}</span>
          ) : (
            <span className="price" style={{ color: 'var(--muted)' }}>PRÓXIMAMENTE</span>
          )}
          <div className="foot-btns">
            {p.mpLink && (
              <a className="mp-btn" href={p.mpLink} target="_blank" rel="noopener">Comprar ahora</a>
            )}
            {confirmedPrice ? (
              <button className={'add-btn' + (pulse ? ' pulse' : '')} onAnimationEnd={() => setPulse(false)} onClick={handleAdd}>
                A la cola
              </button>
            ) : (
              <a className="add-btn" href="#contacto">Consultar</a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ColorSwatches({ selected, onChange }: { selected: Color; onChange: (c: Color) => void }) {
  return (
    <>
      {COLORS.map((c) => (
        <button
          key={c.name}
          className={'swatch' + (c.name === selected.name ? ' active' : '')}
          style={{ background: c.hex }}
          title={c.name}
          aria-label={`Color ${c.name}`}
          onClick={() => onChange(c)}
        />
      ))}
    </>
  );
}
