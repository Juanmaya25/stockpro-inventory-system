import { describe, it, expect } from 'vitest';
import {
  nextId, getMargin, getStockStatus, getStockPercent, getInventoryValue,
  getSalesForMonth, getMonthlySalesTotal, getLowStockCount, getOutOfStockCount,
  getCategories, buildNotifications, filterProducts, sortProducts, getTopProducts,
} from './inventory';

const product = (over = {}) => ({
  id: 1, name: 'Item', sku: 'SK-1', category: 'A',
  price: 100, cost: 60, stock: 10, minStock: 5, ...over,
});

describe('nextId', () => {
  it('returns 1 for an empty list', () => {
    expect(nextId([])).toBe(1);
  });
  it('returns max id + 1, ignoring order', () => {
    expect(nextId([{ id: 3 }, { id: 1 }, { id: 7 }])).toBe(8);
  });
});

describe('getMargin', () => {
  it('computes the integer margin percentage', () => {
    expect(getMargin(product({ price: 100, cost: 60 }))).toBe(40);
  });
  it('returns 0 when price is 0 to avoid dividing by zero', () => {
    expect(getMargin(product({ price: 0, cost: 60 }))).toBe(0);
  });
  it('can be negative when the cost exceeds the price', () => {
    expect(getMargin(product({ price: 50, cost: 75 }))).toBe(-50);
  });
});

describe('getStockStatus', () => {
  it('is "out" when stock is exactly 0', () => {
    expect(getStockStatus(0, 5)).toBe('out');
  });
  it('is "low" at or below the minimum', () => {
    expect(getStockStatus(5, 5)).toBe('low');
    expect(getStockStatus(3, 5)).toBe('low');
  });
  it('is "ok" above the minimum', () => {
    expect(getStockStatus(6, 5)).toBe('ok');
  });
});

describe('getStockPercent', () => {
  it('caps the fill ratio at 100%', () => {
    expect(getStockPercent(product({ stock: 100, minStock: 5 }))).toBe(100);
  });
  it('scales against 3x the minimum stock', () => {
    expect(getStockPercent(product({ stock: 15, minStock: 5 }))).toBe(100);
    expect(getStockPercent(product({ stock: 3, minStock: 5 }))).toBe(20);
  });
});

describe('getInventoryValue', () => {
  it('sums stock times cost across products', () => {
    const products = [product({ stock: 2, cost: 50 }), product({ id: 2, stock: 3, cost: 10 })];
    expect(getInventoryValue(products)).toBe(2 * 50 + 3 * 10);
  });
  it('is 0 for an empty inventory', () => {
    expect(getInventoryValue([])).toBe(0);
  });
});

describe('monthly sales', () => {
  const sales = [
    { id: 1, date: '2026-04-30', total: 100 },
    { id: 2, date: '2026-04-01', total: 50 },
    { id: 3, date: '2026-03-15', total: 999 },
  ];
  it('filters sales by the month prefix', () => {
    expect(getSalesForMonth(sales, '2026-04')).toHaveLength(2);
  });
  it('totals only the matching month', () => {
    expect(getMonthlySalesTotal(sales, '2026-04')).toBe(150);
  });
});

describe('stock counts', () => {
  const products = [
    product({ id: 1, stock: 0, minStock: 5 }),   // out
    product({ id: 2, stock: 4, minStock: 5 }),   // low
    product({ id: 3, stock: 5, minStock: 5 }),   // low
    product({ id: 4, stock: 20, minStock: 5 }),  // ok
  ];
  it('counts low-stock products (out is excluded)', () => {
    expect(getLowStockCount(products)).toBe(2);
  });
  it('counts out-of-stock products', () => {
    expect(getOutOfStockCount(products)).toBe(1);
  });
});

describe('getCategories', () => {
  it('returns unique categories preserving first appearance', () => {
    const products = [product({ category: 'A' }), product({ id: 2, category: 'B' }), product({ id: 3, category: 'A' })];
    expect(getCategories(products)).toEqual(['A', 'B']);
  });
});

describe('buildNotifications', () => {
  it('emits an error for out-of-stock and a warning for low stock', () => {
    const products = [
      product({ id: 1, name: 'Gone', stock: 0, minStock: 5 }),
      product({ id: 2, name: 'Few', stock: 2, minStock: 5 }),
      product({ id: 3, name: 'Fine', stock: 50, minStock: 5 }),
    ];
    const notifs = buildNotifications(products);
    expect(notifs).toHaveLength(2);
    expect(notifs[0]).toMatchObject({ type: 'error', key: 'out-1' });
    expect(notifs[1]).toMatchObject({ type: 'warning', key: 'low-2' });
  });
});

describe('filterProducts', () => {
  const products = [
    product({ id: 1, name: 'Laptop Dell', sku: 'EL-0041', category: 'Electrónica' }),
    product({ id: 2, name: 'Cable HDMI', sku: 'AC-0201', category: 'Accesorios' }),
  ];
  it('matches by name, case-insensitively', () => {
    expect(filterProducts(products, { search: 'dell' })).toHaveLength(1);
  });
  it('matches by SKU', () => {
    expect(filterProducts(products, { search: 'ac-02' })[0].id).toBe(2);
  });
  it('filters by category', () => {
    expect(filterProducts(products, { category: 'Accesorios' })).toHaveLength(1);
  });
  it('returns everything with the defaults', () => {
    expect(filterProducts(products, {})).toHaveLength(2);
  });
});

describe('sortProducts', () => {
  const products = [
    product({ id: 1, name: 'Beta', price: 30 }),
    product({ id: 2, name: 'Alpha', price: 10 }),
    product({ id: 3, name: 'Gamma', price: 20 }),
  ];
  it('sorts strings ascending and descending', () => {
    expect(sortProducts(products, 'name', 'asc').map(p => p.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
    expect(sortProducts(products, 'name', 'desc').map(p => p.name)).toEqual(['Gamma', 'Beta', 'Alpha']);
  });
  it('sorts numbers ascending', () => {
    expect(sortProducts(products, 'price', 'asc').map(p => p.price)).toEqual([10, 20, 30]);
  });
  it('does not mutate the input array', () => {
    const copy = [...products];
    sortProducts(products, 'price', 'desc');
    expect(products).toEqual(copy);
  });
});

describe('getTopProducts', () => {
  const products = [
    product({ id: 1, sku: 'A', name: 'A' }),
    product({ id: 2, sku: 'B', name: 'B' }),
    product({ id: 3, sku: 'C', name: 'C' }),
  ];
  const sales = [
    { sku: 'A', total: 100 }, { sku: 'A', total: 50 },
    { sku: 'B', total: 300 },
  ];
  it('ranks products by accumulated revenue', () => {
    const top = getTopProducts(products, sales);
    expect(top[0]).toMatchObject({ sku: 'B', revenue: 300 });
    expect(top[1]).toMatchObject({ sku: 'A', revenue: 150 });
    expect(top[2]).toMatchObject({ sku: 'C', revenue: 0 });
  });
  it('respects the limit', () => {
    expect(getTopProducts(products, sales, 2)).toHaveLength(2);
  });
});
