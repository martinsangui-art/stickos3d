import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { cartReducer, cartSize, cartTotal, type CartState } from './cartReducer';
import type { Color } from '../data/types';
import { useIgModalContext } from './IgModalContext';
import { trackPixel } from '../lib/pixel';

interface CartContextValue {
  cart: CartState;
  size: number;
  total: number;
  addToCart: (id: string, name: string, price: number, color: Color) => string; // returns the key, for the caller's toast
  inc: (key: string) => void;
  dec: (key: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {} as CartState);
  const { triggerFromCart } = useIgModalContext();

  const addToCart = (id: string, name: string, price: number, color: Color) => {
    const key = `${id}|${color.name}`;
    dispatch({ type: 'add', key, item: { name, price, color: color.name, colorHex: color.hex } });
    // Agregar a la cola es uno de los dos gatillos del modal de Instagram
    // (el otro es scroll pasado el 50%) — ver useIgModal.
    triggerFromCart();
    trackPixel('AddToCart', { content_name: name, content_ids: [id], value: price, currency: 'ARS' });
    return key;
  };
  const inc = (key: string) => dispatch({ type: 'inc', key });
  const dec = (key: string) => dispatch({ type: 'dec', key });

  return (
    <CartContext.Provider value={{ cart, size: cartSize(cart), total: cartTotal(cart), addToCart, inc, dec }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
