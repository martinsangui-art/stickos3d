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

// Rotación automática por hover (solo desktop): mientras el mouse está sobre
// una card con más de un ítem (fotos + video opcional), va avanzando sola
// por el mismo track/dots del slider manual. Al video le toca su turno como
// un ítem más del ciclo: se reproduce muted desde el inicio hasta ~2.5s o su
// propia duración (lo que sea más corto), y recién ahí sigue con la
// siguiente foto.
const TILE_PHOTO_DWELL_MS = 1600;
const TILE_VIDEO_DWELL_MS = 2500;

export function ProductCard({ product: p, selectedColor, onColorChange, onOpenModal, revealDelayMs }: Props) {
  const { addToCart } = useCart();
  const { notify } = useToast();
  const { playBlip } = useSoundContext();
  const [idx, setIdx] = useState(0);
  const [pulse, setPulse] = useState(false);
  const touchStartX = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cycleActiveRef = useRef(false);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const imgs = p.imgs && p.imgs.length ? p.imgs.slice(0, 4) : null;
  const slideCount = (imgs?.length ?? 0) + (p.video ? 1 : 0);
  const videoSlideIdx = imgs ? imgs.length : 0; // el video, si existe, siempre es el último slide
  const confirmedPrice = hasConfirmedPrice(p);
  const status = STOCK_STATUS[p.status];

  function slide(dir: number, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!slideCount) return;
    setIdx((i) => (i + dir + slideCount) % slideCount);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (slideCount < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) >= 40) setIdx((i) => (i + (dx < 0 ? 1 : -1) + slideCount) % slideCount);
  }

  function stopCycle() {
    cycleActiveRef.current = false;
    if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    // Si el mouse se va en medio del preview del video, cortarlo ahí mismo
    // (no lo dejamos sonando/corriendo de fondo).
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function startCycle() {
    if (cycleActiveRef.current) return;
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover)').matches) return;
    if (slideCount < 2) return; // nada para rotar
    cycleActiveRef.current = true;

    const step = (i: number) => {
      if (!cycleActiveRef.current) return;
      setIdx(i);
      if (p.video && i === videoSlideIdx && videoRef.current) {
        const v = videoRef.current;
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          v.removeEventListener('ended', finish);
          v.pause();
          step((i + 1) % slideCount);
        };
        v.currentTime = 0;
        const playPromise = v.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});
        v.addEventListener('ended', finish, { once: true });
        cycleTimerRef.current = setTimeout(finish, TILE_VIDEO_DWELL_MS);
      } else {
        cycleTimerRef.current = setTimeout(() => step((i + 1) % slideCount), TILE_PHOTO_DWELL_MS);
      }
    };
    step(idx);
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
      <div
        className={'tile' + (imgs ? ' has-photo' : '')}
        data-idx={idx}
        onClick={onOpenModal}
        onMouseEnter={imgs ? startCycle : undefined}
        onMouseLeave={imgs ? stopCycle : undefined}
      >
        <div className="tick tl"></div>
        <div className="tick tr"></div>
        <div className="tick bl"></div>
        <div className="tick br"></div>
        {p.video && (
          <span className="video-badge" title="Con video" aria-label="Este producto tiene video">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
        {imgs ? (
          <div className="tile-slider" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="tile-slider-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {imgs.map((src) => (
                <img key={src} className="tile-photo" src={src} alt={p.name} loading="lazy" />
              ))}
              {p.video && <video ref={videoRef} className="tile-photo" src={p.video} muted playsInline preload="metadata" />}
            </div>
            {slideCount > 1 && (
              <>
                <button type="button" className="tile-nav prev" aria-label="Foto anterior" onClick={(e) => slide(-1, e)}>‹</button>
                <button type="button" className="tile-nav next" aria-label="Foto siguiente" onClick={(e) => slide(1, e)}>›</button>
                <div className="tile-dots">
                  {imgs.map((_, i) => (
                    <span key={i} className={'tile-dot' + (i === idx ? ' active' : '')}></span>
                  ))}
                  {p.video && <span className={'tile-dot' + (idx === videoSlideIdx ? ' active' : '')}></span>}
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
