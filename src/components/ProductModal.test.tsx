import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductModal } from './ProductModal';
import { CartProvider, useCart } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { IgModalProvider } from '../context/IgModalContext';
import { VISIBLE_PRODUCTS } from '../data/products';

// jsdom no tiene AudioContext: el blip de los swatches se reemplaza por un no-op.
vi.mock('../context/SoundContext', () => ({
  useSoundContext: () => ({ playBlip: () => {}, soundOn: false, toggle: () => {} }),
}));

function CartProbe() {
  const { cart } = useCart();
  return <pre data-testid="cart">{JSON.stringify(Object.values(cart).map((i) => i.color))}</pre>;
}

function renderModal() {
  const product = VISIBLE_PRODUCTS[0];
  render(
    <ToastProvider>
      <IgModalProvider>
        <CartProvider>
          <ProductModal product={product} onClose={() => {}} />
          <CartProbe />
        </CartProvider>
      </IgModalProvider>
    </ToastProvider>,
  );
}

describe('ProductModal — color del pedido', () => {
  it('sin color elegido, agrega "A coordinar" en vez de un color por defecto', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(screen.getByTestId('cart').textContent).toBe('["A coordinar"]');
  });

  it('con color elegido, agrega ese color', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: /Blanco/ }));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(screen.getByTestId('cart').textContent).toBe('["Blanco"]');
  });
});
