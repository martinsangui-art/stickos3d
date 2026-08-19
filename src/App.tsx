import { useEffect, useState } from 'react';
import { Preloader } from './components/Preloader';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Strip } from './components/Strip';
import { Breather } from './components/Breather';
import { ProductGrid } from './components/ProductGrid';
import { QuoteForm } from './components/QuoteForm';
import { HowToBuy } from './components/HowToBuy';
import { Workshop } from './components/Workshop';
import { ContactForm } from './components/ContactForm';
import { Social } from './components/Social';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { IgModal } from './components/IgModal';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SoundProvider, useSoundContext } from './context/SoundContext';
import { IgModalProvider } from './context/IgModalContext';
import { usePreloader } from './hooks/usePreloader';
import { CONFIG } from './data/config';

export default function App() {
  return (
    <SoundProvider>
      <ToastProvider>
        <IgModalProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </IgModalProvider>
      </ToastProvider>
    </SoundProvider>
  );
}

function AppShell() {
  const preloader = usePreloader();
  const { size } = useCart();
  const { soundOn, toggle } = useSoundContext();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') setCartOpen(false);
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  // Banner de consola — para el que abre DevTools y se pone a mirar.
  useEffect(() => {
    console.log(
      "%cSTICKOS 3D%c\n¿Mirando el código? Armamos webs a medida también.\nEscribinos: https://wa.me/" + CONFIG.whatsapp + '\n',
      "background:#14120F;color:#FF5A1F;font:700 22px/1.8 'Space Grotesk',Helvetica,sans-serif;padding:12px 20px 4px;letter-spacing:-.5px",
      "background:#14120F;color:#F4EFE4;font:400 12px/1.8 'IBM Plex Mono',Menlo,monospace;padding:0 20px 12px",
    );
  }, []);

  return (
    <>
      <Preloader done={preloader.done} onSkip={preloader.hide} />
      <Header cartSize={size} soundOn={soundOn} onToggleSound={toggle} onOpenCart={() => setCartOpen(true)} />
      <Hero />
      <Strip />
      <Breather />
      <ProductGrid />
      <QuoteForm />
      <HowToBuy />
      <Workshop />
      <ContactForm />
      <Social />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toast />
      <WhatsAppFloat />
      <IgModal />
    </>
  );
}
