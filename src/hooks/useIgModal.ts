import { useEffect, useState } from 'react';

const KEY = 'stickos_ig_modal_seen';
const WEEK = 7 * 24 * 60 * 60 * 1000;

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // storage bloqueado: se trata como primera visita
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(KEY, String(Date.now()));
  } catch {
    // sin storage no se recuerda; en el peor caso vuelve a aparecer otra visita
  }
}

// Carrito o modal de producto abiertos: el cliente está comprando, no se lo
// interrumpe. Se lee del DOM porque esos estados viven en componentes que no
// comparten contexto con este hook.
function isShopping(): boolean {
  return Boolean(document.querySelector('.drawer.open, .product-modal:not([hidden])'));
}

/* Modal "Seguinos en Instagram" (5 % off si nos seguís). Único gatillo: scroll
   pasado el 50 % de la página, y nunca con el carrito o un modal de producto
   abierto — en ese caso sigue armado y aparece en el próximo scroll con la
   pantalla libre. Antes también se disparaba al tocar "Agregar", justo en el
   momento en que el cliente decidía comprar. No vuelve a aparecer hasta pasada
   una semana (localStorage). */
export function useIgModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const last = readSeen();
    if (last && Date.now() - parseInt(last, 10) <= WEEK) return; // ya se mostró esta semana

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0 || doc.scrollTop / scrollable <= 0.5) return;
      if (isShopping()) return;
      window.removeEventListener('scroll', onScroll);
      setShow(true);
      markSeen();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { show, hide: () => setShow(false) };
}
