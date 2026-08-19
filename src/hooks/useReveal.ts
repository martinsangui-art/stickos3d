import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './motion';

/* Scroll-reveal por elemento. El original observaba document.querySelectorAll(".reveal")
   una sola vez con un IntersectionObserver global; acá cada elemento que quiere el
   efecto pide su propio ref+estado, que es el equivalente idiomático en React —
   mismo threshold/rootMargin/comportamiento "revela una vez y desconecta". */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, className: 'reveal' + (revealed ? ' in' : '') };
}
