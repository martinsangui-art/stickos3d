import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useSound } from '../hooks/useSound';

interface SoundContextValue {
  soundOn: boolean;
  toggle: () => void;
  playBlip: (freq: number) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { soundOn, toggle, playBlip } = useSound(audioRef);

  return (
    <SoundContext.Provider value={{ soundOn, toggle, playBlip }}>
      {children}
      {/* Loop ambiente del taller. preload="none": no se descarga hasta que
          alguien activa el sonido, así no pesa en la carga inicial. */}
      <audio ref={audioRef} src="/assets/workshop-loop.mp3" loop preload="none" />
    </SoundContext.Provider>
  );
}

export function useSoundContext(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSoundContext must be used inside <SoundProvider>');
  return ctx;
}
