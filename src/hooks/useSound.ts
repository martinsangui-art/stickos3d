import { useEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './motion';

const SOUND_KEY = 'stickos_sound_on';

/* ============================================================
   SONIDO DEL TALLER — activado por defecto en la primera visita,
   salvo que la persona ya lo haya apagado a mano antes (se respeta
   esa elección). Blips de interacción por Web Audio + loop real del
   taller de fondo. Los navegadores bloquean el autoplay con audio,
   así que solo arranca con un gesto real de la persona: el toggle,
   o cualquier primer click/touch/tecla en la página.

   Portado 1:1 del <script> original — misma key de localStorage,
   mismas curvas de frecuencia/ganancia, mismo timing de 6 capas de
   .483s para el boot del cabezal.
   ============================================================ */
export function useSound(workshopAudioRef: RefObject<HTMLAudioElement>) {
  // Sin preferencia guardada (primera visita) arranca activado. Si alguien lo
  // apagó a mano en una visita anterior (quedó guardado "0"), se respeta esa
  // elección — el default nuevo no pisa una decisión explícita.
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem(SOUND_KEY);
    return stored === null ? true : stored === '1';
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundOnRef = useRef(soundOn);
  soundOnRef.current = soundOn;

  function ensureAudioCtx(): AudioContext {
    if (!audioCtxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctor();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function playBlip(freq: number) {
    if (!soundOnRef.current) return;
    const ctx = ensureAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  }

  /* Fade a mano con setInterval: HTMLMediaElement.volume no es automatizable
     como los AudioParam de Web Audio, no acepta rampas. */
  function fadeAudio(target: number, duration = 800) {
    const audio = workshopAudioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const steps = 20;
    const stepTime = duration / steps;
    const startVol = audio.volume;
    const diff = target - startVol;
    let i = 0;
    fadeIntervalRef.current = setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, startVol + diff * (i / steps)));
      if (i >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        // Pausar recién al final del fade, si no se corta de golpe.
        if (target === 0) audio.pause();
      }
    }, stepTime);
  }

  function startAmbient() {
    const audio = workshopAudioRef.current;
    if (!audio) return;
    audio.volume = 0;
    // El catch se traga el rechazo por política de autoplay: si el navegador lo
    // bloquea, no pasa nada y arranca con el primer gesto del usuario.
    audio.play().catch(() => {});
    fadeAudio(0.28);
  }
  function stopAmbient() {
    fadeAudio(0);
  }

  /* Sonido del cabezal durante el preloader: seis pasadas de motor paso a paso,
     una por capa, sincronizadas con la animación. Ojo: los navegadores bloquean
     el audio hasta que hay un gesto del usuario, así que en la PRIMERA visita
     esto no suena aunque el sonido esté activado. Suena al recargar/volver
     dentro de la misma sesión, después de cualquier click. */
  function playPrinterBoot() {
    if (!soundOnRef.current) return;
    let ctx: AudioContext;
    try {
      ctx = ensureAudioCtx();
    } catch {
      return;
    }
    if (ctx.state !== 'running') return; // bloqueado por autoplay: se saltea, sin romper nada
    const LAYER = 0.483;
    const LAYERS = 6; // igual que la animación: 6 capas de .483s
    for (let i = 0; i < LAYERS; i++) {
      const t = ctx.currentTime + i * LAYER;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      // el motor sube de tono con cada capa, como cuando el eje Z va subiendo
      osc.frequency.setValueAtTime(180 + i * 14, t);
      osc.frequency.linearRampToValueAtTime(320 + i * 14, t + LAYER * 0.75);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.03);
      gain.gain.setValueAtTime(0.035, t + LAYER * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + LAYER * 0.92);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + LAYER);
    }
  }

  function toggle() {
    setSoundOn((prev) => {
      const next = !prev;
      window.localStorage.setItem(SOUND_KEY, next ? '1' : '0');
      if (next) {
        startAmbient();
        playBlip(660);
      } else {
        stopAmbient();
      }
      return next;
    });
  }

  // Si el sonido está activado (por default en la primera visita, o porque
  // venía así de una visita anterior), arranca con la primera interacción de
  // la persona con la página — cualquiera, no hace falta que sea el ícono de
  // sonido puntual. Es la misma política de autoplay del navegador de siempre:
  // necesita un gesto real, así que hay que esperarlo.
  useEffect(() => {
    let done = false;
    function tryStart() {
      if (done) return;
      done = true;
      document.removeEventListener('click', tryStart);
      document.removeEventListener('touchstart', tryStart);
      document.removeEventListener('keydown', tryStart);
      if (soundOnRef.current) startAmbient();
    }
    document.addEventListener('click', tryStart);
    document.addEventListener('touchstart', tryStart, { passive: true });
    document.addEventListener('keydown', tryStart);
    return () => {
      document.removeEventListener('click', tryStart);
      document.removeEventListener('touchstart', tryStart);
      document.removeEventListener('keydown', tryStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sonido del cabezal, solo cuando el preloader se está mostrando de verdad.
  useEffect(() => {
    if (soundOnRef.current && !prefersReducedMotion) playPrinterBoot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { soundOn, toggle, playBlip };
}
