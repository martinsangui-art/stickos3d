import { useEffect, useState } from 'react';
import { Preloader } from './components/Preloader';
import { StructuredData } from './components/StructuredData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Strip } from './components/Strip';
import { Breather } from './components/Breather';
import { ProductGrid } from './components/ProductGrid';
import { QuoteForm } from './components/QuoteForm';
import { HowToBuy } from './components/HowToBuy';
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

  return (
    <>
      <StructuredData />
      <Preloader done={preloader.done} onSkip={preloader.hide} />
      <Header cartSize={size} soundOn={soundOn} onToggleSound={toggle} onOpenCart={() => setCartOpen(true)} />
      <Hero />
      <Strip />
      <Breather />
      <ProductGrid />
      <QuoteForm />
      <HowToBuy />
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
