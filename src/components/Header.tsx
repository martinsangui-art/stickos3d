import { useEffect, useRef, useState } from 'react';
import { useHeaderScroll } from '../hooks/useHeaderScroll';
import { CONFIG } from '../data/config';

interface Props {
  cartSize: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpenCart: () => void;
}

const NAV_LINKS: [href: string, label: string][] = [
  ['#catalogo', 'Catálogo'],
  ['#pedido', 'Cotizador'],
  ['#contacto', 'Contacto'],
  [`https://instagram.com/${CONFIG.instagram}`, 'Instagram'],
];

const MOBILE_LINKS: [href: string, label: string][] = [
  ['#catalogo', 'Catálogo'],
  ['#pedido', 'Cotizador'],
  ['#comprar', 'Cómo comprar'],
  ['#nosotros', 'El taller'],
  ['#contacto', 'Contacto'],
  [`https://instagram.com/${CONFIG.instagram}`, 'Instagram'],
];

export function Header({ cartSize, soundOn, onToggleSound, onOpenCart }: Props) {
  const scrolled = useHeaderScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  // Bump del contador: se remonta el <span> (key distinta) cada vez que el
  // carrito crece, así el navegador reinicia la animación CSS .bump desde
  // cero sin necesitar el truco de reflow (void el.offsetWidth) del original.
  const prevSizeRef = useRef(cartSize);
  const [bumpKey, setBumpKey] = useState(0);
  useEffect(() => {
    if (cartSize > prevSizeRef.current) setBumpKey((k) => k + 1);
    prevSizeRef.current = cartSize;
  }, [cartSize]);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [menuOpen]);

  return (
    <>
      {/* Barra de estado — dato real del negocio (materiales, alcance de
          envío, estado del taller), no decoración. Va FUERA del <header>
          a propósito: el header es sticky y sumarle 32px comería viewport
          en mobile; así la barra se lee al entrar y después se va con el
          scroll. */}
      <div className="statusbar">
        <div className="wrap">
          <div className="grp">
            <span>Bahía Blanca · AR</span>
            <span>Materiales <b>PLA / PETG / TPU</b></span>
            <span>Envíos <b>a todo el país</b></span>
          </div>
          <span className="live"><i></i>Taller activo</span>
        </div>
      </div>
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="wrap nav">
        <a href="#" className="logo" aria-label="STICKOS 3D — inicio">
          <span className="wm">
            <span className="wm-b">
              STICKOS<em>3D</em>
            </span>
            <span className="wm-t" aria-hidden="true">
              STICKOS<em>3D</em>
            </span>
          </span>
          <small>IMPRESIÓN 3D</small>
        </a>
        <nav className="nav-links">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="menu-btn"
            id="menuBtn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobileNav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          <a
            href={`https://instagram.com/${CONFIG.instagram}`}
            target="_blank"
            rel="noopener"
            className="sound-btn"
            aria-label="Seguinos en Instagram"
            title="Seguinos en Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="3" width="18" height="18" rx="5.2" />
              <circle cx="12" cy="12" r="4.1" />
              <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <button
            className={'sound-btn' + (soundOn ? ' on' : '')}
            id="soundToggle"
            type="button"
            aria-pressed={soundOn}
            aria-label="Sonido del taller"
            title="Sonido del taller"
            onClick={onToggleSound}
          >
            {!soundOn && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                <line x1="16" y1="9" x2="21" y2="15" />
                <line x1="21" y1="9" x2="16" y2="15" />
              </svg>
            )}
            {soundOn && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 6a9 9 0 0 1 0 12" />
              </svg>
            )}
          </button>
          <button className="cart-btn" id="openCart" aria-label="Abrir cola de impresión" onClick={onOpenCart}>
            Cola <span className={'cart-count' + (bumpKey > 0 ? ' bump' : '')} id="cartCount" key={bumpKey}>{cartSize}</span>
          </button>
        </div>
      </div>
      <nav className="mobile-nav wrap" id="mobileNav" hidden={!menuOpen}>
        {MOBILE_LINKS.map(([href, label]) => (
          <a
            key={href}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
    </>
  );
}
