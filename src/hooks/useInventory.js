import { useMemo, useState } from 'react';
import { INIT_PRODUCTS, INIT_SALES, INIT_SUPPLIERS, INIT_CLIENTS, CURRENT_MONTH } from '../data/seeds';
import {
  nextId, getInventoryValue, getMonthlySalesTotal, getLowStockCount,
  getOutOfStockCount, getCategories, buildNotifications, getTopProducts,
} from '../utils/inventory';

/**
 * Owns every domain entity (products, sales, suppliers, clients), the CRUD
 * actions over them and the derived metrics. Actions return `true` on
 * success so the caller can decide whether to close the active modal.
 */
export function useInventory(showToast) {
  const [products, setProducts]   = useState(INIT_PRODUCTS);
  const [sales, setSales]         = useState(INIT_SALES);
  const [suppliers, setSuppliers] = useState(INIT_SUPPLIERS);
  const [clients, setClients]     = useState(INIT_CLIENTS);

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`Campo "${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  // ── Products ──────────────────────────────────────────────────────
  const saveProduct = (form, editTarget) => {
    if (!validate([['Nombre', form.name], ['SKU', form.sku], ['Precio', form.price]])) return false;
    const p = { ...form, price: +form.price || 0, cost: +form.cost || 0, stock: +form.stock || 0, minStock: +form.minStock || 5 };
    if (!editTarget) {
      setProducts(pp => [...pp, { ...p, id: nextId(pp) }]);
      showToast('Producto agregado correctamente');
    } else {
      setProducts(pp => pp.map(x => x.id === editTarget.id ? { ...x, ...p } : x));
      showToast('Producto actualizado');
    }
    return true;
  };

  const deleteProduct = (id) => {
    setProducts(pp => pp.filter(x => x.id !== id));
    showToast('Producto eliminado');
  };

  // ── Sales ─────────────────────────────────────────────────────────
  const registerSale = (form) => {
    if (!validate([['Producto', form.sku], ['Cantidad', form.qty]])) return false;
    const prod = products.find(p => p.sku === form.sku);
    if (!prod) return false;
    const qty = +form.qty || 1;
    if (qty > prod.stock) { showToast(`Stock insuficiente. Solo hay ${prod.stock} unidades`, 'error'); return false; }
    setSales(ss => [...ss, {
      id: nextId(ss), date: new Date().toISOString().split('T')[0],
      product: prod.name, sku: prod.sku, qty, total: prod.price * qty,
      client: form.client || 'Cliente general', method: form.method || 'Efectivo',
    }]);
    setProducts(pp => pp.map(p => p.sku === form.sku ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
    showToast(`Venta registrada: $${(prod.price * qty).toLocaleString()}`);
    return true;
  };

  const deleteSale = (id) => {
    setSales(ss => ss.filter(x => x.id !== id));
    showToast('Venta eliminada');
  };

  // ── Suppliers ─────────────────────────────────────────────────────
  const saveSupplier = (form, editTarget) => {
    if (!validate([['Nombre', form.name], ['Contacto', form.contact]])) return false;
    if (!editTarget) {
      setSuppliers(ss => [...ss, { ...form, id: nextId(ss), products:0, status:'active', rating:3 }]);
    } else {
      setSuppliers(ss => ss.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
    }
    showToast(editTarget ? 'Proveedor actualizado' : 'Proveedor agregado');
    return true;
  };

  const deleteSupplier = (id) => {
    setSuppliers(ss => ss.filter(x => x.id !== id));
    showToast('Proveedor eliminado');
  };

  // ── Clients ───────────────────────────────────────────────────────
  const saveClient = (form, editTarget) => {
    if (!validate([['Nombre', form.name]])) return false;
    if (!editTarget) {
      setClients(cc => [...cc, { ...form, id: nextId(cc), purchases:0, total:0 }]);
    } else {
      setClients(cc => cc.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
    }
    showToast(editTarget ? 'Cliente actualizado' : 'Cliente agregado');
    return true;
  };

  const deleteClient = (id) => {
    setClients(cc => cc.filter(x => x.id !== id));
    showToast('Cliente eliminado');
  };

  // ── Derived metrics ───────────────────────────────────────────────
  const totalValue   = useMemo(() => getInventoryValue(products), [products]);
  const monthlySales = useMemo(() => getMonthlySalesTotal(sales, CURRENT_MONTH), [sales]);
  const lowCount     = useMemo(() => getLowStockCount(products), [products]);
  const outCount     = useMemo(() => getOutOfStockCount(products), [products]);
  const categories   = useMemo(() => getCategories(products), [products]);
  const notifs       = useMemo(() => buildNotifications(products), [products]);
  const topProducts  = useMemo(() => getTopProducts(products, sales), [products, sales]);

  return {
    products, sales, suppliers, clients,
    saveProduct, deleteProduct, registerSale, deleteSale,
    saveSupplier, deleteSupplier, saveClient, deleteClient,
    totalValue, monthlySales, lowCount, outCount, categories, notifs, topProducts,
  };
}
