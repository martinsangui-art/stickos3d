export interface CartItem {
  name: string;
  price: number;
  color: string;
  colorHex: string;
  qty: number;
}

export type CartState = Record<string, CartItem>;

export type CartAction =
  | { type: 'add'; key: string; item: Omit<CartItem, 'qty'> }
  | { type: 'inc'; key: string }
  | { type: 'dec'; key: string };

/* Carrito (en memoria de la sesión) — clave: producto + color.
   Extraído del manejador de click delegado del original como reducer puro,
   para poder testear las reglas (sumar cantidad, borrar en 0) sin DOM. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state[action.key];
      return {
        ...state,
        [action.key]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { ...action.item, qty: 1 },
      };
    }
    case 'inc': {
      const existing = state[action.key];
      if (!existing) return state;
      return { ...state, [action.key]: { ...existing, qty: existing.qty + 1 } };
    }
    case 'dec': {
      const existing = state[action.key];
      if (!existing) return state;
      if (existing.qty <= 1) {
        const next = { ...state };
        delete next[action.key];
        return next;
      }
      return { ...state, [action.key]: { ...existing, qty: existing.qty - 1 } };
    }
    default:
      return state;
  }
}

export function cartSize(cart: CartState): number {
  return Object.values(cart).reduce((a, i) => a + i.qty, 0);
}

export function cartTotal(cart: CartState): number {
  return Object.values(cart).reduce((a, i) => a + i.qty * i.price, 0);
}
