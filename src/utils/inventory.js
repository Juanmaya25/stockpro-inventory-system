// Pure domain logic for the inventory: every business rule lives here,
// detached from React, so it can be unit-tested in isolation.

export const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;

/** Profit margin as integer percentage. 0 when the price is not set. */
export const getMargin = p => (p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0);

/** 'out' | 'low' | 'ok' — single source of truth for stock semantics. */
export const getStockStatus = (stock, minStock) =>
  stock === 0 ? 'out' : stock <= minStock ? 'low' : 'ok';

/** Fill ratio for the stock progress bar (100% = 3× the minimum stock). */
export const getStockPercent = p =>
  Math.min(100, Math.round((p.stock / Math.max(p.minStock * 3, 1)) * 100));

export const getInventoryValue = products =>
  products.reduce((s, p) => s + p.stock * p.cost, 0);

export const getSalesForMonth = (sales, month) => sales.filter(s => s.date.startsWith(month));

export const getMonthlySalesTotal = (sales, month) =>
  getSalesForMonth(sales, month).reduce((a, s) => a + s.total, 0);

export const getLowStockCount = products =>
  products.filter(p => getStockStatus(p.stock, p.minStock) === 'low').length;

export const getOutOfStockCount = products =>
  products.filter(p => p.stock === 0).length;

export const getCategories = products => [...new Set(products.map(p => p.category))];

export const buildNotifications = (products) => {
  const n = [];
  products.filter(p => p.stock === 0)
    .forEach(p => n.push({ key:`out-${p.id}`, type:'error',   text:`${p.name} está agotado`,                  time:'hace 2 min' }));
  products.filter(p => getStockStatus(p.stock, p.minStock) === 'low')
    .forEach(p => n.push({ key:`low-${p.id}`, type:'warning', text:`Stock bajo: ${p.name} (${p.stock} uds)`, time:'hace 5 min' }));
  return n;
};

export const filterProducts = (products, { search = '', category = 'all' }) => {
  const q = search.toLowerCase();
  return products.filter(p =>
    (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
    (category === 'all' || p.category === category)
  );
};

export const sortProducts = (products, sortBy, sortDir) =>
  [...products].sort((a, b) => {
    const aV = a[sortBy], bV = b[sortBy];
    const cmp = typeof aV === 'string' ? aV.localeCompare(bV) : aV - bV;
    return sortDir === 'asc' ? cmp : -cmp;
  });

export const getTopProducts = (products, sales, limit = 5) =>
  [...products]
    .map(p => ({ ...p, revenue: sales.filter(s => s.sku === p.sku).reduce((a, s) => a + s.total, 0) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
