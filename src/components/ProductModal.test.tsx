import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductModal } from './ProductModal';
import { CartProvider, useCart } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { IgModalProvider } from '../context/IgModalContext';
import { VISIBLE_PRODUCTS } from '../data/products';

function CartProbe() {
  const { cart } = useCart();
  return <pre data-testid="cart">{JSON.stringify(cart)}</pre>;
}

const product = VISIBLE_PRODUCTS[0];

function renderModal() {
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

describe('ProductModal — sin selector de color', () => {
  afterEach(() => vi.restoreAllMocks());

  it('no muestra swatches y avisa que el color se coordina por WhatsApp', () => {
    renderModal();
    expect(document.querySelector('.swatch')).toBeNull();
    expect(screen.getByText(/Elegís los colores al confirmar por WhatsApp/)).toBeInTheDocument();
  });

  it('"Agregar" suma el producto con su id como clave', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(JSON.parse(screen.getByTestId('cart').textContent!)).toEqual({
      [product.id]: { name: product.name, price: product.price, qty: 1 },
    });
  });

  it('"Consultar por WhatsApp" pregunta por los colores', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Consultar por WhatsApp' }));
    const text = new URL(open.mock.calls[0][0] as string).searchParams.get('text');
    expect(text).toBe(`¡Hola STICKOS 3D! Quiero pedir ${product.name}. ¿Qué colores hay?`);
  });
});
