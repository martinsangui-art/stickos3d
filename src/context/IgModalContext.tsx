import { createContext, useContext, type ReactNode } from 'react';
import { useIgModal } from '../hooks/useIgModal';

interface IgModalContextValue {
  show: boolean;
  hide: () => void;
  triggerFromCart: () => void;
}

const IgModalContext = createContext<IgModalContextValue | null>(null);

export function IgModalProvider({ children }: { children: ReactNode }) {
  const value = useIgModal();
  return <IgModalContext.Provider value={value}>{children}</IgModalContext.Provider>;
}

export function useIgModalContext(): IgModalContextValue {
  const ctx = useContext(IgModalContext);
  if (!ctx) throw new Error('useIgModalContext must be used inside <IgModalProvider>');
  return ctx;
}
