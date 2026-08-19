import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ProductGrid } from './ProductGrid';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { SoundProvider } from '../context/SoundContext';
import { IgModalProvider } from '../context/IgModalContext';

function renderGrid() {
  return render(
    <SoundProvider>
      <ToastProvider>
        <IgModalProvider>
          <CartProvider>
            <ProductGrid />
          </CartProvider>
        </IgModalProvider>
      </ToastProvider>
    </SoundProvider>,
  );
}

describe('ProductGrid deep-linking (?p=<id>)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('opens the product modal on mount when the URL has ?p=<id>', () => {
    window.history.replaceState(null, '', '/?p=p17');
    renderGrid();
    // p17 = ONDA — el nombre aparece tanto en la card como en el <h3> del modal.
    expect(screen.getAllByText('ONDA').length).toBeGreaterThan(1);
  });

  it('ignores an unknown product id instead of crashing', () => {
    window.history.replaceState(null, '', '/?p=no-existe');
    renderGrid();
    expect(document.querySelector('.product-modal[hidden]')).not.toBeNull();
  });

  it('updates the URL to ?p=<id> when a product card is clicked, and clears it on close', async () => {
    const user = userEvent.setup();
    renderGrid();
    expect(window.location.search).toBe('');

    const tile = document.querySelector('[data-card="p17"] .tile')!;
    await user.click(tile);
    await waitFor(() => expect(window.location.search).toBe('?p=p17'));

    const closeBtn = screen.getByRole('button', { name: 'Cerrar' });
    await user.click(closeBtn);
    await waitFor(() => expect(window.location.search).toBe(''));
  });
});
