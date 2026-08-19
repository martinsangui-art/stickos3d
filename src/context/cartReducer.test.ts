import { describe, expect, it } from 'vitest';
import { cartReducer, cartSize, cartTotal, type CartState } from './cartReducer';

const item = { name: 'Llavero personalizado con nombre', price: 3500, color: 'Negro', colorHex: '#2A2A2E' };

describe('cartReducer', () => {
  it('adds a new product+color as qty 1', () => {
    const state = cartReducer({}, { type: 'add', key: 'p8|Negro', item });
    expect(state['p8|Negro'].qty).toBe(1);
  });

  it('adding the same product+color again increments qty instead of duplicating', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8|Negro', item });
    state = cartReducer(state, { type: 'add', key: 'p8|Negro', item });
    expect(Object.keys(state)).toHaveLength(1);
    expect(state['p8|Negro'].qty).toBe(2);
  });

  it('the same product in a different color is a separate line item', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8|Negro', item });
    state = cartReducer(state, { type: 'add', key: 'p8|Blanco', item: { ...item, color: 'Blanco', colorHex: '#E8E6E0' } });
    expect(Object.keys(state)).toHaveLength(2);
  });

  it('dec below 1 removes the line item entirely', () => {
    let state: CartState = cartReducer({}, { type: 'add', key: 'p8|Negro', item });
    state = cartReducer(state, { type: 'dec', key: 'p8|Negro' });
    expect(state['p8|Negro']).toBeUndefined();
  });

  it('dec above 1 just decrements', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8|Negro', item });
    state = cartReducer(state, { type: 'inc', key: 'p8|Negro' });
    state = cartReducer(state, { type: 'dec', key: 'p8|Negro' });
    expect(state['p8|Negro'].qty).toBe(1);
  });

  it('cartSize sums quantities across all line items', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8|Negro', item });
    state = cartReducer(state, { type: 'add', key: 'p14|Negro', item: { ...item, name: 'Ala Nocturna', price: 3500 } });
    state = cartReducer(state, { type: 'inc', key: 'p8|Negro' });
    expect(cartSize(state)).toBe(3);
  });

  it('cartTotal multiplies price by qty per line item', () => {
    let state: CartState = {};
    state = cartReducer(state, { type: 'add', key: 'p8|Negro', item: { ...item, price: 3500 } });
    state = cartReducer(state, { type: 'inc', key: 'p8|Negro' }); // qty 2 @ 3500
    state = cartReducer(state, { type: 'add', key: 'p3|Negro', item: { ...item, price: 31500 } }); // qty 1 @ 31500
    expect(cartTotal(state)).toBe(2 * 3500 + 31500);
  });
});
