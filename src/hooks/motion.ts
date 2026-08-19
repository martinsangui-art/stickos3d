// Evaluado una sola vez al cargar el módulo — igual que el original, que lo
// lee una vez y lo reusa (no reacciona a que el usuario cambie la preferencia
// del sistema operativo en medio de la sesión).
export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
