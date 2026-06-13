import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInventory } from './useInventory';

const setup = () => {
  const showToast = vi.fn();
  const { result } = renderHook(() => useInventory(showToast));
  return { result, showToast };
};

describe('useInventory', () => {
  it('seeds the demo dataset and derives the critical-stock metrics', () => {
    const { result } = setup();
    expect(result.current.products).toHaveLength(8);
    expect(result.current.outCount).toBe(1); // Teclado Mecánico K2
    expect(result.current.lowCount).toBe(1); // Mouse Logitech MX3
  });

  it('adds a product, coercing numeric fields, and reports success', () => {
    const { result, showToast } = setup();
    let ok;
    act(() => { ok = result.current.saveProduct({ name: 'New', sku: 'NW-1', price: '200', cost: '120' }); });
    expect(ok).toBe(true);
    expect(result.current.products).toHaveLength(9);
    const added = result.current.products.at(-1);
    expect(added).toMatchObject({ name: 'New', price: 200, cost: 120, minStock: 5 });
    expect(showToast).toHaveBeenCalledWith('Producto agregado correctamente');
  });

  it('rejects an invalid product and surfaces a validation toast', () => {
    const { result, showToast } = setup();
    let ok;
    act(() => { ok = result.current.saveProduct({ name: '', sku: '', price: '' }); });
    expect(ok).toBe(false);
    expect(result.current.products).toHaveLength(8);
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('requerido'), 'error');
  });

  it('registers a sale and decrements the product stock', () => {
    const { result } = setup();
    const before = result.current.products.find(p => p.sku === 'EL-0041').stock;
    act(() => { result.current.registerSale({ sku: 'EL-0041', qty: '2' }); });
    const after = result.current.products.find(p => p.sku === 'EL-0041').stock;
    expect(after).toBe(before - 2);
    expect(result.current.sales.at(-1)).toMatchObject({ sku: 'EL-0041', qty: 2, total: 1299 * 2 });
  });

  it('blocks a sale that exceeds available stock', () => {
    const { result, showToast } = setup();
    let ok;
    act(() => { ok = result.current.registerSale({ sku: 'EL-0088', qty: '9999' }); });
    expect(ok).toBe(false);
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('insuficiente'), 'error');
  });

  it('deletes a product by id', () => {
    const { result } = setup();
    act(() => { result.current.deleteProduct(1); });
    expect(result.current.products.find(p => p.id === 1)).toBeUndefined();
    expect(result.current.products).toHaveLength(7);
  });
});
