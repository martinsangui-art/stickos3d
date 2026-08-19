import { useEffect, useState } from 'react';

const KEY = 'stickos_ig_modal_seen';
const WEEK = 7 * 24 * 60 * 60 * 1000;

/* Modal "Seguinos en Instagram" — aparece una sola vez a los 5s de cargada
   la página, y no vuelve a aparecer hasta pasada una semana (localStorage). */
export function useIgModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const last = window.localStorage.getItem(KEY);
    const now = Date.now();
    if (!last || now - parseInt(last, 10) > WEEK) {
      const t = setTimeout(() => {
        setShow(true);
        window.localStorage.setItem(KEY, String(now));
      }, 5000);
      return () => clearTimeout(t);
    }
  }, []);

  return { show, hide: () => setShow(false) };
}
