import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './motion';

/* La animación se muestra en TODAS las cargas, también al refrescar.
   Duración: 2.9s de impresión + 0.7s con la pieza terminada en pantalla.
   Es un punto medio: alcanza para verla, sin dejar esperando al que llega
   desde una publicidad. Además se puede saltear con cualquier gesto.
   Para ajustarla, PRINT_MS acá y los 2.9s de src/styles/global.css se
   mueven juntos. */
export function usePreloader() {
  const [done, setDone] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const PRINT_MS = 3600; // 2.9s de animación + 0.7s de pausa final
    const t0 = performance.now();
    let finished = false;
    const hide = () => {
      if (finished) return;
      finished = true;
      setDone(true);
    };
    const finish = () => setTimeout(hide, Math.max(0, PRINT_MS - (performance.now() - t0)));

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);

    const safetyNet = setTimeout(hide, 4800); // red de seguridad si "load" nunca llega

    // Salteo: cualquier gesto la corta al instante. El que tiene apuro, entra.
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, hide, { once: true, passive: true }));

    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(safetyNet);
      events.forEach((ev) => window.removeEventListener(ev, hide));
    };
  }, []);

  return { done, hide: () => setDone(true) };
}
