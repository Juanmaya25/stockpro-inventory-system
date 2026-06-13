import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { useInventory } from '../hooks/useInventory';
import { useProductFilters } from '../hooks/useProductFilters';
import { useModalForm } from '../hooks/useModalForm';
import { downloadCsv } from '../utils/csv';

import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Toast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';

import { Dashboard } from '../components/Dashboard';
import { Products } from '../components/Products';
import { Sales } from '../components/Sales';
import { Suppliers } from '../components/Suppliers';
import { Clients } from '../components/Clients';
import { Reports } from '../components/Reports';

import { ProductForm } from '../components/forms/ProductForm';
import { SaleForm } from '../components/forms/SaleForm';
import { SupplierForm } from '../components/forms/SupplierForm';
import { ClientForm } from '../components/forms/ClientForm';

const APP_FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

/**
 * Wires the domain hooks to the UI tree: owns the cross-cutting view state
 * (active page, notifications panel, delete confirmation) and translates the
 * presentational callbacks into domain actions.
 */
export function AppShell() {
  const { C } = useTheme();
  const { toast, showToast } = useToast();
  const inv = useInventory(showToast);
  const filters = useProductFilters(inv.products);
  const { modal, editTarget, form, fv, openAdd, openEdit, closeModal } = useModalForm();

  const [page, setPage]           = useState('dashboard');
  const [dateRange, setDateRange] = useState('month');
  const [showNotifs, setShowNotifs] = useState(false);
  const [confirm, setConfirm]     = useState(null);

  const criticalCount = inv.outCount + inv.lowCount;

  // ── Cross-cutting handlers ─────────────────────────────────────────
  const handleExport = (data, name) => {
    if (!data.length) { showToast('No hay datos para exportar', 'error'); return; }
    downloadCsv(data, name);
    showToast(`Archivo ${name}.csv descargado`);
  };

  const askDelete = (msg, run) => setConfirm({ msg, onYes: () => { run(); setConfirm(null); } });

  const navigate = (id) => { setPage(id); filters.resetFilters(); };
  const quickAdd = (target, type) => { setPage(target); openAdd(type); };

  const saveProduct  = () => { if (inv.saveProduct(form, editTarget)) closeModal(); };
  const registerSale = () => { if (inv.registerSale(form)) closeModal(); };
  const saveSupplier = () => { if (inv.saveSupplier(form, editTarget)) closeModal(); };
  const saveClient   = () => { if (inv.saveClient(form, editTarget)) closeModal(); };

  // ── Page switch ────────────────────────────────────────────────────
  const pages = {
    dashboard: (
      <Dashboard
        products={inv.products} sales={inv.sales}
        totalValue={inv.totalValue} monthlySales={inv.monthlySales}
        lowCount={inv.lowCount} outCount={inv.outCount}
        dateRange={dateRange} onDateRangeChange={setDateRange}
        onExport={handleExport} onNavigate={navigate} onQuickAdd={quickAdd}
      />
    ),
    inventory: (
      <Products
        products={inv.products} filteredProducts={filters.filteredProducts}
        categories={inv.categories} lowCount={inv.lowCount} outCount={inv.outCount}
        search={filters.search} onSearchChange={filters.setSearch}
        catFilter={filters.catFilter} onCatFilterChange={filters.setCatFilter}
        sortBy={filters.sortBy} sortDir={filters.sortDir} onSort={filters.sortToggle}
        onResetFilters={filters.resetFilters}
        onExport={handleExport} onAdd={() => openAdd('product')}
        onEdit={(p) => openEdit('product', p)}
        onDelete={(id) => askDelete('¿Eliminar este producto?', () => inv.deleteProduct(id))}
      />
    ),
    sales: (
      <Sales
        sales={inv.sales} monthlySales={inv.monthlySales}
        onExport={handleExport} onAdd={() => openAdd('sale')}
        onDelete={(id) => askDelete('¿Eliminar esta venta?', () => inv.deleteSale(id))}
      />
    ),
    suppliers: (
      <Suppliers
        suppliers={inv.suppliers} onAdd={() => openAdd('supplier')}
        onEdit={(s) => openEdit('supplier', s)}
        onDelete={(id) => askDelete('¿Eliminar este proveedor?', () => inv.deleteSupplier(id))}
      />
    ),
    clients: (
      <Clients
        clients={inv.clients} onAdd={() => openAdd('client')}
        onEdit={(c) => openEdit('client', c)}
        onDelete={(id) => askDelete('¿Eliminar este cliente?', () => inv.deleteClient(id))}
      />
    ),
    analytics: <Reports topProducts={inv.topProducts} onExport={handleExport} />,
  };

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:APP_FONT, color:C.text, fontSize:14}}>
      {modal === 'product' && (
        <Modal title={editTarget ? 'Editar producto' : 'Agregar producto'} onClose={closeModal} onSave={saveProduct}>
          <ProductForm form={form} fv={fv} suppliers={inv.suppliers} />
        </Modal>
      )}
      {modal === 'sale' && (
        <Modal title="Registrar venta" onClose={closeModal} onSave={registerSale} saveLabel="Registrar venta">
          <SaleForm form={form} fv={fv} products={inv.products} clients={inv.clients} />
        </Modal>
      )}
      {modal === 'supplier' && (
        <Modal title={editTarget ? 'Editar proveedor' : 'Agregar proveedor'} onClose={closeModal} onSave={saveSupplier}>
          <SupplierForm form={form} fv={fv} editTarget={editTarget} />
        </Modal>
      )}
      {modal === 'client' && (
        <Modal title={editTarget ? 'Editar cliente' : 'Agregar cliente'} onClose={closeModal} onSave={saveClient}>
          <ClientForm form={form} fv={fv} />
        </Modal>
      )}

      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} />
      <Toast toast={toast} />

      <Header
        notifs={inv.notifs} showNotifs={showNotifs}
        onToggleNotifs={() => setShowNotifs(s => !s)}
        outCount={inv.outCount} lowCount={inv.lowCount}
      />

      <div style={{display:'grid', gridTemplateColumns:'212px 1fr'}}>
        <Sidebar
          page={page} onNavigate={navigate}
          onViewDetails={() => setPage('inventory')}
          criticalCount={criticalCount}
        />
        <main style={{padding:'24px 28px', overflowY:'auto'}}>{pages[page] || pages.dashboard}</main>
      </div>
    </div>
  );
}
