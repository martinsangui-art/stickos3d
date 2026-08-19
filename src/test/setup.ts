import '@testing-library/jest-dom/vitest';

// jsdom no implementa matchMedia — lo usan useReveal (prefers-reduced-motion)
// y el ciclo de hover con video de ProductCard (hover: hover). Sin este
// stub, cualquier componente que los importe rompe en tests con
// "window.matchMedia is not a function", aunque el test no toque esa lógica.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom no implementa reproducción de audio/video real: HTMLMediaElement.play()
// devuelve undefined en vez de la Promise que devuelven todos los navegadores
// reales desde hace años. useSound.ts (ambient loop) y ProductCard (preview de
// video en hover) asumen la Promise real (`audio.play().catch(...)`), como
// corresponde — el stub va acá, no en el código de la app.
if (typeof window !== 'undefined' && window.HTMLMediaElement) {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
}
