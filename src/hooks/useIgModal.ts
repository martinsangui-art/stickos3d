import { useEffect, useRef, useState } from 'react';

const KEY = 'stickos_ig_modal_seen';
const WEEK = 7 * 24 * 60 * 60 * 1000;

/* Modal "Seguinos en Instagram" — dispara con lo que pase primero: scroll
   pasado el 50% de la página, o un producto agregado a la cola de impresión
   (ver triggerFromCart, llamado desde CartContext.addToCart). No vuelve a
   aparecer hasta pasada una semana (localStorage).

   Portado del <script> inline del original: ahí el gatillo del carrito vivía
   en window.__igCartTrigger porque addToCart y este bloque eran scripts
   separados sin módulo compartido; acá el mismo rol lo cumple IgModalContext,
   que expone triggerFromCart() a quien lo necesite (CartContext) sin
   variables globales. */
export function useIgModal() {
  const [show, setShow] = useState(false);
  const armedRef = useRef(false);
  const triggerRef = useRef<() => void>(() => {});

  useEffect(() => {
    const last = window.localStorage.getItem(KEY);
    const now = Date.now();
    if (!last || now - parseInt(last, 10) > WEEK) {
      armedRef.current = true;
    } else {
      return; // ya se mostró esta semana: no arma scroll listener ni trigger
    }

    function trigger() {
      if (!armedRef.current) return;
      armedRef.current = false;
      window.removeEventListener('scroll', onScroll);
      setShow(true);
      window.localStorage.setItem(KEY, String(Date.now()));
    }
    triggerRef.current = trigger;

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      if (doc.scrollTop / scrollable > 0.5) trigger();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      armedRef.current = false;
    };
  }, []);

  return {
    show,
    hide: () => setShow(false),
    triggerFromCart: () => triggerRef.current(),
  };
}
