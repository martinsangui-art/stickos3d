import { useState } from 'react';
import { CONFIG } from '../data/config';
import { useReveal } from '../hooks/useReveal';

export function Social() {
  const reveal = useReveal<HTMLDivElement>();
  // Si las fotos todavía no están subidas, la grilla se saca sola en vez de
  // mostrar dos íconos de imagen rota. Al subir los archivos aparece sin
  // tocar nada más.
  const [gridBroken, setGridBroken] = useState(false);

  return (
    <section className="social" id="redes">
      <div className={`wrap ${reveal.className}`} ref={reveal.ref}>
        <div className="eyebrow">Capa 06 — Redes</div>
        <h2 className="sec-title">Seguinos en redes</h2>
        <p className="social-copy">Ahí van saliendo las piezas terminadas, los colores nuevos de filamento y los trabajos a medida que todavía no están en el catálogo.</p>
        {!gridBroken && (
          <div className="social-grid">
            <img src="/assets/ig-post-1.jpg" alt="Publicación de STICKOS 3D en Instagram" loading="lazy" onError={() => setGridBroken(true)} />
            <img src="/assets/ig-post-2.jpg" alt="Publicación de STICKOS 3D en Instagram" loading="lazy" onError={() => setGridBroken(true)} />
          </div>
        )}
        <a className="btn btn-primary" id="socialIg" href={`https://instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3" y="3" width="18" height="18" rx="5.2" />
            <circle cx="12" cy="12" r="4.1" />
            <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" stroke="none" />
          </svg>
          <span>Ver más en @stickos3de</span>
        </a>
      </div>
    </section>
  );
}
