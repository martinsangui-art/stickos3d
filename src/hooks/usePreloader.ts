import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './motion';

const SEEN_KEY = 'stk_preloader_seen';

/* Solo en la primera visita de la sesión, y nunca si se llega con ?p=<id>
   (link compartido de un producto: el que entra quiere ver esa pieza ya).
   Duración: 1.2s de impresión + 0.3s con la pieza terminada en pantalla.
   Además se puede saltear con cualquier gesto.
   Para ajustarla, PRINT_MS acá y los 1.2s de src/styles/global.css se
   mueven juntos. */
function shouldSkip(): boolean {
  if (prefersReducedMotion) return true;
  if (new URLSearchParams(window.location.search).has('p')) return true;
  try {
    return window.sessionStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return false; // storage bloqueado (modo privado, etc.): se muestra
  }
}

export function usePreloader() {
  const [done, setDone] = useState(shouldSkip);

  useEffect(() => {
    if (done) return;
    // Se marca acá y no en shouldSkip: StrictMode llama dos veces al
    // inicializador de useState y la segunda ya lo encontraría marcado.
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // sin storage no se recuerda: se vuelve a mostrar en la próxima carga
    }

    const PRINT_MS = 1500; // 1.2s de animación + 0.3s de pausa final
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

    const safetyNet = setTimeout(hide, 2500); // red de seguridad si "load" nunca llega

    // Salteo: cualquier gesto la corta al instante. El que tiene apuro, entra.
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, hide, { once: true, passive: true }));

    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(safetyNet);
      events.forEach((ev) => window.removeEventListener(ev, hide));
    };
    // Solo decide en el montaje: si arrancó visible, corre hasta ocultarse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { done, hide: () => setDone(true) };
}
