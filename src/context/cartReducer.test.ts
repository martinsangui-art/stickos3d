import { describe, expect, it } from 'vitest';
import { cartReducer, cartSize, cartTotal, type CartState } from './cartReducer';

const item = { name: 'Llavero personalizado con nombre', price: 3500 };

describe('cartReducer', () => {
  it('adds a new product as qty 1', () => {
    const state = cartReducer({}, { type: 'add', key: 'p8', item });
    expect(state['p8'].qty).toBe(1);
  });

  it('adding the same product again increments qty instead of duplicating', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8', item });
    state = cartReducer(state, { type: 'add', key: 'p8', item });
    expect(Object.keys(state)).toHaveLength(1);
    expect(state['p8'].qty).toBe(2);
  });

  it('a different product is a separate line item', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8', item });
    state = cartReducer(state, { type: 'add', key: 'p14', item: { ...item, name: 'Ala Nocturna' } });
    expect(Object.keys(state)).toHaveLength(2);
  });

  it('dec below 1 removes the line item entirely', () => {
    let state: CartState = cartReducer({}, { type: 'add', key: 'p8', item });
    state = cartReducer(state, { type: 'dec', key: 'p8' });
    expect(state['p8']).toBeUndefined();
  });

  it('dec above 1 just decrements', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8', item });
    state = cartReducer(state, { type: 'inc', key: 'p8' });
    state = cartReducer(state, { type: 'dec', key: 'p8' });
    expect(state['p8'].qty).toBe(1);
  });

  it('cartSize sums quantities across all line items', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8', item });
    state = cartReducer(state, { type: 'add', key: 'p14', item: { ...item, name: 'Ala Nocturna', price: 3500 } });
    state = cartReducer(state, { type: 'inc', key: 'p8' });
    expect(cartSize(state)).toBe(3);
  });

  it('cartTotal multiplies price by qty per line item', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8', item: { ...item, price: 3500 } });
    state = cartReducer(state, { type: 'inc', key: 'p8' }); // qty 2 @ 3500
    state = cartReducer(state, { type: 'add', key: 'p3', item: { ...item, price: 31500 } }); // qty 1 @ 31500
    expect(cartTotal(state)).toBe(2 * 3500 + 31500);
  });
});
