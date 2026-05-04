import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from "recharts";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_PRODUCTS = [
  { id:1, name:'Laptop Dell XPS 13',   sku:'EL-0041', category:'Electrónica',    price:1299, cost:950, stock:36,  minStock:5,  supplier:'TechSupply S.A.', barcode:'7701234567001' },
  { id:2, name:'Mouse Logitech MX3',   sku:'EL-0088', category:'Electrónica',    price:89,   cost:55,  stock:8,   minStock:10, supplier:'TechSupply S.A.', barcode:'7701234567002' },
  { id:3, name:'Monitor LG 27"',       sku:'EL-0112', category:'Electrónica',    price:349,  cost:240, stock:22,  minStock:3,  supplier:'LG Colombia',     barcode:'7701234567003' },
  { id:4, name:'Teclado Mecánico K2',  sku:'HW-0034', category:'Hardware',       price:149,  cost:90,  stock:0,   minStock:5,  supplier:'KeyMasters',      barcode:'7701234567004' },
  { id:5, name:'Cable HDMI 2m',        sku:'AC-0201', category:'Accesorios',     price:12,   cost:5,   stock:145, minStock:20, supplier:'AccesoriosCol',   barcode:'7701234567005' },
  { id:6, name:'SSD Samsung 1TB',      sku:'ST-0055', category:'Almacenamiento', price:120,  cost:80,  stock:14,  minStock:5,  supplier:'Samsung Dist.',   barcode:'7701234567006' },
  { id:7, name:'Auriculares Sony XM5', sku:'AU-0019', category:'Audio',          price:279,  cost:190, stock:7,   minStock:3,  supplier:'Sony Colombia',   barcode:'7701234567007' },
  { id:8, name:'Webcam Logitech C922', sku:'CA-0033', category:'Electrónica',    price:99,   cost:65,  stock:18,  minStock:5,  supplier:'TechSupply S.A.', barcode:'7701234567008' },
];

const INIT_SALES = [
  { id:1, date:'2026-04-30', product:'Laptop Dell XPS 13',   sku:'EL-0041', qty:2,  total:2598, client:'Empresa ABC',   method:'Transferencia' },
  { id:2, date:'2026-04-30', product:'Mouse Logitech MX3',   sku:'EL-0088', qty:3,  total:267,  client:'Juan Pérez',    method:'Efectivo' },
  { id:3, date:'2026-04-29', product:'Monitor LG 27"',       sku:'EL-0112', qty:1,  total:349,  client:'Maria López',   method:'Tarjeta' },
  { id:4, date:'2026-04-29', product:'Cable HDMI 2m',        sku:'AC-0201', qty:10, total:120,  client:'TechCorp S.A.', method:'Transferencia' },
  { id:5, date:'2026-04-28', product:'SSD Samsung 1TB',      sku:'ST-0055', qty:3,  total:360,  client:'Carlos Ruiz',   method:'Tarjeta' },
  { id:6, date:'2026-04-28', product:'Auriculares Sony XM5', sku:'AU-0019', qty:2,  total:558,  client:'Digital Store', method:'Transferencia' },
];

const INIT_SUPPLIERS = [
  { id:1, name:'TechSupply S.A.', contact:'Carlos Mendez', email:'cmendez@techsupply.co',  phone:'310-555-0101', products:24, status:'active',   rating:5 },
  { id:2, name:'LG Colombia',     contact:'Ana García',    email:'agarcia@lgcol.com',       phone:'310-555-0202', products:8,  status:'active',   rating:4 },
  { id:3, name:'Samsung Dist.',   contact:'Luis Torres',   email:'ltorres@samsung.co',      phone:'310-555-0303', products:12, status:'active',   rating:5 },
  { id:4, name:'KeyMasters',      contact:'Rosa Jiménez',  email:'rjimenez@keymasters.co',  phone:'310-555-0404', products:6,  status:'inactive', rating:3 },
  { id:5, name:'AccesoriosCol',   contact:'Pedro Vargas',  email:'pvargas@accesorios.co',   phone:'310-555-0505', products:35, status:'active',   rating:4 },
  { id:6, name:'Sony Colombia',   contact:'Diana Castro',  email:'dcastro@sonycol.com',     phone:'310-555-0606', products:9,  status:'active',   rating:5 },
];

const INIT_CLIENTS = [
  { id:1, name:'Empresa ABC',  email:'compras@abc.co',     phone:'310-100-2000', purchases:12, total:24500 },
  { id:2, name:'TechCorp S.A.', email:'orders@techcorp.co', phone:'310-300-4000', purchases:8,  total:15200 },
  { id:3, name:'Digital Store', email:'info@digital.co',    phone:'310-500-6000', purchases:5,  total:8900  },
  { id:4, name:'Carlos Ruiz',  email:'cruiz@gmail.com',    phone:'310-700-8000', purchases:3,  total:1850  },
];

const monthlyData = [
  { mes:'Nov', entradas:320, salidas:210, ventas:18500 },
  { mes:'Dic', entradas:410, salidas:380, ventas:28000 },
  { mes:'Ene', entradas:280, salidas:190, ventas:15200 },
  { mes:'Feb', entradas:390, salidas:310, ventas:21000 },
  { mes:'Mar', entradas:450, salidas:280, ventas:19800 },
  { mes:'Abr', entradas:520, salidas:390, ventas:23180 },
];

// PALETTE: SaaS B2B refinado — verde neón sobre fondo oscuro / blanco crujiente en light
const themes = {
  dark: {
    bg:        '#0a0e14',
    bg2:       '#0f1419',
    bg3:       '#161c24',
    accent:    '#00d4aa',
    accent2:   '#4f8ef7',
    accent3:   '#f7a24f',
    red:       '#f05566',
    purple:    '#a78bfa',
    text:      '#e2e8f0',
    text2:     '#94a3b8',
    text3:     '#64748b',
    border:    '#1e293b',
    borderLite:'#2d3a4f',
    accentTxt: '#0a0e14',  // texto sobre accent
    shadow:    '0 1px 3px rgba(0,0,0,.3)',
    shadowLg:  '0 12px 40px rgba(0, 212, 170, .15)',
  },
  light: {
    bg:        '#f8fafc',
    bg2:       '#ffffff',
    bg3:       '#f1f5f9',
    accent:    '#10b981',
    accent2:   '#3b82f6',
    accent3:   '#f59e0b',
    red:       '#ef4444',
    purple:    '#8b5cf6',
    text:      '#0f172a',
    text2:     '#475569',
    text3:     '#94a3b8',
    border:    '#e2e8f0',
    borderLite:'#cbd5e1',
    accentTxt: '#ffffff',
    shadow:    '0 1px 3px rgba(15,23,42,.06)',
    shadowLg:  '0 12px 40px rgba(16, 185, 129, .12)',
  },
};

const INIT_CAT_DATA = [
  { name:'Electrónica',    value:35, color:'#00d4aa' },
  { name:'Hardware',       value:25, color:'#4f8ef7' },
  { name:'Accesorios',     value:20, color:'#f7a24f' },
  { name:'Audio',          value:12, color:'#f05566' },
  { name:'Almacenamiento', value:8,  color:'#a78bfa' },
];

// ─── SVG ICONS — todo SVG inline, NADA de emojis ────────────────────
const Icon = {
  // Acciones
  pencil: ({size=14}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  trash: ({size=14}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>,
  check: ({size=14}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  download: ({size=14}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  plus: ({size=16}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: ({size=14}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: ({size=18}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  alert: ({size=18}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  close: ({size=18}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  sun: ({size=18}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: ({size=18}={}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,

  // Nav
  grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  box: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  cart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  factory: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20V8l-6 3V8l-6 3V8l-6 3v9z"/><path d="M9 16h2"/><path d="M14 16h2"/><path d="M5 16h2"/></svg>,
  users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  star: (filled=true) => filled
    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  trendUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  trendDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  arrowRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────

function StockBadge({ stock, minStock, C }) {
  const s = stock === 0
    ? { l:'Agotado',     bg:`${C.red}20`,     c:C.red,     dot:C.red }
    : stock <= minStock
      ? { l:'Stock bajo', bg:`${C.accent3}20`, c:C.accent3, dot:C.accent3 }
      : { l:'En stock',   bg:`${C.accent}20`,  c:C.accent,  dot:C.accent };
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:100, background:s.bg, color:s.c, whiteSpace:'nowrap'}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:s.dot}} />
      {s.l}
    </span>
  );
}

function Stars({ n, C }) {
  return (
    <span style={{display:'inline-flex', gap:1}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{color: i <= n ? '#f5c842' : C.text3, display:'flex'}}>
          {Icon.star(i <= n)}
        </span>
      ))}
    </span>
  );
}

function Modal({ title, onClose, onSave, saveLabel='Guardar', children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(10, 14, 20, .7)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:0, width:'100%', maxWidth: size==='lg' ? 720 : 540, boxShadow:C.shadowLg, overflow:'hidden'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{padding:'18px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <h2 style={{fontSize:16, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, cursor:'pointer', padding:6, borderRadius:6, display:'flex'}}>
            {Icon.close()}
          </button>
        </div>
        <div style={{padding:24}}>{children}</div>
        <div style={{padding:'14px 24px', borderTop:`1px solid ${C.border}`, background:C.bg3, display:'flex', gap:10, justifyContent:'flex-end'}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]           = useState('dark');
  const [page, setPage]             = useState('dashboard');
  const [products, setProducts]     = useState(INIT_PRODUCTS);
  const [sales, setSales]           = useState(INIT_SALES);
  const [suppliers, setSuppliers]   = useState(INIT_SUPPLIERS);
  const [clients, setClients]       = useState(INIT_CLIENTS);
  const [modal, setModal]           = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState({});
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('all');
  const [sortBy, setSortBy]         = useState('name');
  const [sortDir, setSortDir]       = useState('asc');
  const [toast, setToast]           = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [dateRange, setDateRange]   = useState('month');

  const C = themes[theme];

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;
  const openAdd  = type => { setModal(type); setEditTarget(null); setForm({}); };
  const openEdit = (type, item) => { setModal(type); setEditTarget(item); setForm({ ...item }); };
  const closeModal = useCallback(() => { setModal(null); setEditTarget(null); setForm({}); }, []);

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`Campo "${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  const saveProduct = () => {
    if (!validate([['Nombre', form.name], ['SKU', form.sku], ['Precio', form.price]])) return;
    const p = { ...form, price: +form.price || 0, cost: +form.cost || 0, stock: +form.stock || 0, minStock: +form.minStock || 5 };
    if (!editTarget) {
      setProducts(pp => [...pp, { ...p, id: nextId(pp) }]);
      showToast('Producto agregado correctamente');
    } else {
      setProducts(pp => pp.map(x => x.id === editTarget.id ? { ...x, ...p } : x));
      showToast('Producto actualizado');
    }
    closeModal();
  };

  const delProduct = id => setConfirm({
    msg: '¿Eliminar este producto?',
    onYes: () => { setProducts(pp => pp.filter(x => x.id !== id)); showToast('Producto eliminado'); setConfirm(null); }
  });

  const saveSale = () => {
    if (!validate([['Producto', form.sku], ['Cantidad', form.qty]])) return;
    const prod = products.find(p => p.sku === form.sku);
    if (!prod) return;
    const qty = +form.qty || 1;
    if (qty > prod.stock) { showToast(`Stock insuficiente. Solo hay ${prod.stock} unidades`, 'error'); return; }
    setSales(ss => [...ss, {
      id: nextId(ss), date: new Date().toISOString().split('T')[0],
      product: prod.name, sku: prod.sku, qty, total: prod.price * qty,
      client: form.client || 'Cliente general', method: form.method || 'Efectivo',
    }]);
    setProducts(pp => pp.map(p => p.sku === form.sku ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
    showToast(`Venta registrada: $${(prod.price * qty).toLocaleString()}`);
    closeModal();
  };

  const delSale = id => setConfirm({
    msg: '¿Eliminar esta venta?',
    onYes: () => { setSales(ss => ss.filter(x => x.id !== id)); showToast('Venta eliminada'); setConfirm(null); }
  });

  const saveSupplier = () => {
    if (!validate([['Nombre', form.name], ['Contacto', form.contact]])) return;
    if (!editTarget) {
      setSuppliers(ss => [...ss, { ...form, id: nextId(ss), products:0, status:'active', rating:3 }]);
    } else {
      setSuppliers(ss => ss.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
    }
    showToast(editTarget ? 'Proveedor actualizado' : 'Proveedor agregado');
    closeModal();
  };

  const delSupplier = id => setConfirm({
    msg: '¿Eliminar este proveedor?',
    onYes: () => { setSuppliers(ss => ss.filter(x => x.id !== id)); showToast('Proveedor eliminado'); setConfirm(null); }
  });

  const saveClient = () => {
    if (!validate([['Nombre', form.name]])) return;
    if (!editTarget) {
      setClients(cc => [...cc, { ...form, id: nextId(cc), purchases:0, total:0 }]);
    } else {
      setClients(cc => cc.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
    }
    showToast(editTarget ? 'Cliente actualizado' : 'Cliente agregado');
    closeModal();
  };

  const delClient = id => setConfirm({
    msg: '¿Eliminar este cliente?',
    onYes: () => { setClients(cc => cc.filter(x => x.id !== id)); showToast('Cliente eliminado'); setConfirm(null); }
  });

  const exportCSV = (data, name) => {
    if (!data.length) { showToast('No hay datos para exportar', 'error'); return; }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Archivo ${name}.csv descargado`);
  };

  // Computed
  const totalValue   = useMemo(() => products.reduce((s, p) => s + p.stock * p.cost, 0), [products]);
  const monthlySales = useMemo(() => sales.filter(s => s.date.startsWith('2026-04')).reduce((a, s) => a + s.total, 0), [sales]);
  const lowCount     = useMemo(() => products.filter(p => p.stock > 0 && p.stock <= p.minStock).length, [products]);
  const outCount     = useMemo(() => products.filter(p => p.stock === 0).length, [products]);
  const categories   = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const notifs = useMemo(() => {
    const n = [];
    products.filter(p => p.stock === 0).forEach(p => n.push({ key:`out-${p.id}`, type:'error',   text:`${p.name} está agotado`,                  time:'hace 2 min' }));
    products.filter(p => p.stock > 0 && p.stock <= p.minStock).forEach(p => n.push({ key:`low-${p.id}`, type:'warning', text:`Stock bajo: ${p.name} (${p.stock} uds)`, time:'hace 5 min' }));
    return n;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let arr = products.filter(p => {
      const q = search.toLowerCase();
      return (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) && (catFilter === 'all' || p.category === catFilter);
    });
    arr.sort((a, b) => {
      const aV = a[sortBy], bV = b[sortBy];
      const cmp = typeof aV === 'string' ? aV.localeCompare(bV) : aV - bV;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [products, search, catFilter, sortBy, sortDir]);

  const topProducts = useMemo(() =>
    [...products]
      .map(p => ({ ...p, revenue: sales.filter(s => s.sku === p.sku).reduce((a, s) => a + s.total, 0) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    [products, sales]
  );

  const sortToggle = (key) => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortDir('asc'); }
  };

  const S = {
    card:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:20, boxShadow:C.shadow },
    input:   { background:C.bg3, border:`1px solid ${C.borderLite}`, borderRadius:8, padding:'9px 12px', fontSize:13, color:C.text, width:'100%', fontFamily:'inherit', outline:'none', boxSizing:'border-box', transition:'border-color .15s, box-shadow .15s' },
    label:   { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase' },
    btnPri:  { background:C.accent, color:C.accentTxt, border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'opacity .15s, transform .15s' },
    btnGhost:{ background:'transparent', color:C.text2, border:`1px solid ${C.borderLite}`, borderRadius:8, padding:'9px 16px', fontSize:13, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, transition:'all .15s' },
    btnIcon: { background:'transparent', color:C.text2, border:'none', cursor:'pointer', padding:7, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
  };

  const focusH = {
    onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
    onBlur:  e => { e.target.style.borderColor = C.borderLite; e.target.style.boxShadow = 'none'; },
  };

  const TH = ({ children, sortKey }) => (
    <th
      onClick={sortKey ? () => sortToggle(sortKey) : undefined}
      style={{
        fontSize:11, color:C.text2, fontWeight:600, textAlign:'left',
        padding:'12px 14px', borderBottom:`1px solid ${C.border}`,
        textTransform:'uppercase', letterSpacing:'.4px', whiteSpace:'nowrap',
        cursor: sortKey ? 'pointer' : 'default', userSelect:'none',
      }}>
      <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
        {children}
        {sortKey === sortBy && <span style={{color:C.accent, fontSize:10}}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  );
  const TD_BASE = { padding:'12px 14px', fontSize:13, borderBottom:`1px solid ${C.border}` };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Dashboard</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>
            {new Date().toLocaleDateString('es-CO', {day:'numeric', month:'long', year:'numeric'})}
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <select style={{...S.input, width:'auto'}} value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button style={S.btnGhost} onClick={() => exportCSV(sales, 'ventas_resumen')}>
            <Icon.download /> Exportar
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:18}}>
        {[
          { l:'Productos',         v:products.length,                          sub:`${lowCount} con stock bajo`, c:C.accent,  trend:12 },
          { l:'Valor inventario',  v:`$${totalValue.toLocaleString()}`,        sub:'Costo total',                c:C.accent2, trend:8  },
          { l:'Ventas del mes',    v:`$${monthlySales.toLocaleString()}`,      sub:`${sales.filter(s => s.date.startsWith('2026-04')).length} transacciones`, c:C.accent3, trend:15 },
          { l:'Stock crítico',     v:outCount + lowCount,                      sub:`${outCount} agotados`,       c:C.red,     trend:-5 },
        ].map(k => (
          <div key={k.l} style={{...S.card, borderTop:`2px solid ${k.c}`, position:'relative'}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:10}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:700, color:k.c, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px', marginBottom:8}}>{k.v}</div>
            <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6}}>
              <span style={{display:'inline-flex', alignItems:'center', gap:3, color: k.trend > 0 ? C.accent : C.red, fontWeight:700}}>
                {k.trend > 0 ? <Icon.trendUp /> : <Icon.trendDown />}
                {Math.abs(k.trend)}%
              </span>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.6fr) minmax(0,1fr)', gap:14, marginBottom:18}}>
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:14}}>
            <div>
              <div style={{fontSize:14, fontWeight:700, marginBottom:2, color:C.text}}>Movimiento de inventario</div>
              <div style={{fontSize:12, color:C.text2}}>Entradas vs salidas — últimos 6 meses</div>
            </div>
            <div style={{display:'flex', gap:14, fontSize:11, color:C.text2}}>
              <span style={{display:'inline-flex', alignItems:'center', gap:5}}><span style={{width:10, height:10, borderRadius:2, background:C.accent}}/>Entradas</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:5}}><span style={{width:10, height:10, borderRadius:2, background:C.accent2}}/>Salidas</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, boxShadow:C.shadowLg}} />
              <Bar dataKey="entradas" fill={C.accent}  radius={[4, 4, 0, 0]} name="Entradas" />
              <Bar dataKey="salidas"  fill={C.accent2} radius={[4, 4, 0, 0]} name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:2, color:C.text}}>Por categoría</div>
          <div style={{fontSize:12, color:C.text2, marginBottom:10}}>Distribución actual</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={INIT_CAT_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {INIT_CAT_DATA.map(e => <Cell key={e.name} fill={e.color} stroke={C.bg2} strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14}}>
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div style={{fontSize:14, fontWeight:700, color:C.text}}>Últimas ventas</div>
            <button onClick={() => setPage('sales')} style={{...S.btnGhost, padding:'6px 12px', fontSize:12}}>Ver todas <Icon.arrowRight /></button>
          </div>
          <div style={{margin:'0 -20px', overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead><tr><TH>Producto</TH><TH>Cliente</TH><TH>Total</TH></tr></thead>
              <tbody>
                {sales.slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td style={{...TD_BASE, fontWeight:600, color:C.text}}>{s.product}</td>
                    <td style={{...TD_BASE, color:C.text2, fontSize:12}}>{s.client}</td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, color:C.accent, textAlign:'right'}}>${s.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14, color:C.text}}>Acciones rápidas</div>
          {[
            { label:'Agregar producto',  icon:Icon.box,     action: () => { setPage('inventory'); openAdd('product');  }, color:C.accent  },
            { label:'Registrar venta',   icon:Icon.cart,    action: () => { setPage('sales');     openAdd('sale');     }, color:C.accent2 },
            { label:'Agregar proveedor', icon:Icon.factory, action: () => { setPage('suppliers'); openAdd('supplier'); }, color:C.accent3 },
            { label:'Agregar cliente',   icon:Icon.users,   action: () => { setPage('clients');   openAdd('client');   }, color:C.purple  },
          ].map(a => (
            <button
              key={a.label}
              onClick={a.action}
              style={{
                display:'flex', alignItems:'center', gap:12,
                width:'100%', textAlign:'left', marginBottom:8,
                background:`${a.color}10`, color:a.color,
                border:`1px solid ${a.color}25`,
                borderRadius:10, padding:'11px 14px',
                fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                transition:'transform .15s, background .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${a.color}20`; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              {a.icon()} {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Inventario</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{filteredProducts.length} de {products.length} productos</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredProducts, 'inventario')}><Icon.download /> Exportar CSV</button>
          <button style={S.btnPri} onClick={() => openAdd('product')}><Icon.plus /> Agregar producto</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:18}}>
        {[
          { l:'Total',      v:products.length,                                   sub:'productos',          c:C.accent  },
          { l:'En stock',   v:products.filter(p => p.stock > p.minStock).length, sub:'productos',          c:'#22c55e' },
          { l:'Stock bajo', v:lowCount,                                          sub:'requieren atención', c:C.accent3 },
          { l:'Agotados',   v:outCount,                                          sub:'productos',          c:C.red     },
        ].map(k => (
          <div key={k.l} style={{...S.card, padding:'16px 18px'}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:800, color:k.c, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px', lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:11, color:C.text3, marginTop:6}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:320}}>
          <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:36}} placeholder="Buscar nombre o SKU..." value={search} onChange={e => setSearch(e.target.value)} {...focusH} />
        </div>
        <select style={{...S.input, width:'auto'}} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || catFilter !== 'all') && <button style={S.btnGhost} onClick={() => { setSearch(''); setCatFilter('all'); }}>Limpiar filtros</button>}
      </div>

      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:960}}>
            <thead style={{background:C.bg3}}>
              <tr>
                <TH sortKey="name">Producto</TH>
                <TH sortKey="sku">SKU</TH>
                <TH>Categoría</TH>
                <TH sortKey="stock">Stock</TH>
                <TH>Mín</TH>
                <TH sortKey="price">Precio</TH>
                <TH>Costo</TH>
                <TH>Margen</TH>
                <TH>Estado</TH>
                <TH></TH>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const margin = p.price > 0 ? Math.round((p.price - p.cost) / p.price * 100) : 0;
                const pct    = Math.min(100, Math.round(p.stock / Math.max(p.minStock * 3, 1) * 100));
                return (
                  <tr key={p.id}
                    style={{transition:'background .12s'}}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{...TD_BASE, fontWeight:600, color:C.text}}>{p.name}</td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontSize:11, color:C.text2}}>{p.sku}</td>
                    <td style={{...TD_BASE, fontSize:12, color:C.text2}}>{p.category}</td>
                    <td style={TD_BASE}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{width:48, height:5, borderRadius:3, background:C.bg3}}>
                          <div style={{width:`${pct}%`, height:'100%', borderRadius:3, background: p.stock === 0 ? C.red : p.stock <= p.minStock ? C.accent3 : C.accent, transition:'width .3s'}} />
                        </div>
                        <span style={{fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, fontSize:12, color:C.text}}>{p.stock}</span>
                      </div>
                    </td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontSize:12, color:C.text2}}>{p.minStock}</td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, color:C.accent}}>${p.price}</td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontSize:12, color:C.text2}}>${p.cost}</td>
                    <td style={{...TD_BASE, fontWeight:700, color: margin > 30 ? C.accent : margin > 15 ? C.accent3 : C.red}}>{margin}%</td>
                    <td style={TD_BASE}><StockBadge stock={p.stock} minStock={p.minStock} C={C} /></td>
                    <td style={TD_BASE}>
                      <div style={{display:'flex', gap:4, justifyContent:'flex-end'}}>
                        <button style={S.btnIcon} onClick={() => openEdit('product', p)} aria-label="Editar"
                          onMouseEnter={e => { e.currentTarget.style.background = `${C.accent}20`; e.currentTarget.style.color = C.accent; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                          <Icon.pencil />
                        </button>
                        <button style={S.btnIcon} onClick={() => delProduct(p.id)} aria-label="Eliminar"
                          onMouseEnter={e => { e.currentTarget.style.background = `${C.red}20`; e.currentTarget.style.color = C.red; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}>
                          <Icon.trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Ventas</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{sales.length} transacciones registradas</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(sales, 'ventas')}><Icon.download /> Exportar</button>
          <button style={S.btnPri} onClick={() => openAdd('sale')}><Icon.plus /> Registrar venta</button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginBottom:18}}>
        {[
          { l:'Total acumulado', v:`$${sales.reduce((a, s) => a + s.total, 0).toLocaleString()}`, sub:'Todas las ventas',   c:C.accent  },
          { l:'Este mes',        v:`$${monthlySales.toLocaleString()}`,                            sub:'Abril 2026',         c:C.accent2 },
          { l:'Ticket promedio', v:`$${Math.round(sales.reduce((a, s) => a + s.total, 0) / Math.max(sales.length, 1)).toLocaleString()}`, sub:'Por transacción', c:C.accent3 },
        ].map(k => (
          <div key={k.l} style={{...S.card, padding:'16px 18px', borderTop:`2px solid ${k.c}`}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:22, fontWeight:700, color:k.c, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px'}}>{k.v}</div>
            <div style={{fontSize:11, color:C.text3, marginTop:5}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
            <thead style={{background:C.bg3}}><tr><TH>Fecha</TH><TH>Producto</TH><TH>Cliente</TH><TH>Cantidad</TH><TH>Total</TH><TH>Método</TH><TH></TH></tr></thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .12s'}}>
                  <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontSize:12, color:C.text2}}>{s.date}</td>
                  <td style={{...TD_BASE, fontWeight:600, color:C.text}}>{s.product}</td>
                  <td style={{...TD_BASE, color:C.text2, fontSize:12}}>{s.client}</td>
                  <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', textAlign:'center', fontWeight:700, color:C.text}}>{s.qty}</td>
                  <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, color:C.accent, textAlign:'right'}}>${s.total.toLocaleString()}</td>
                  <td style={TD_BASE}><span style={{fontSize:11, background:C.bg3, padding:'3px 10px', borderRadius:8, color:C.text2, fontWeight:500}}>{s.method}</span></td>
                  <td style={TD_BASE}>
                    <button style={S.btnIcon} onClick={() => delSale(s.id)} aria-label="Eliminar"
                      onMouseEnter={e => { e.currentTarget.style.background = `${C.red}20`; e.currentTarget.style.color = C.red; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}>
                      <Icon.trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Proveedores</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{suppliers.length} proveedores registrados</div>
        </div>
        <button style={S.btnPri} onClick={() => openAdd('supplier')}><Icon.plus /> Agregar proveedor</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:14}}>
        {suppliers.map(s => (
          <div key={s.id}
            style={{...S.card, borderLeft:`3px solid ${s.status === 'active' ? C.accent : C.red}`, transition:'transform .15s, box-shadow .15s'}}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = C.shadowLg; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = C.shadow; }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14}}>
              <div>
                <div style={{fontSize:15, fontWeight:700, marginBottom:2, color:C.text, letterSpacing:'-.2px'}}>{s.name}</div>
                <div style={{fontSize:12, color:C.text2}}>{s.contact}</div>
              </div>
              <span style={{fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, background: s.status === 'active' ? `${C.accent}20` : `${C.red}20`, color: s.status === 'active' ? C.accent : C.red, display:'inline-flex', alignItems:'center', gap:5, whiteSpace:'nowrap'}}>
                <span style={{width:6, height:6, borderRadius:'50%', background: s.status === 'active' ? C.accent : C.red}} />
                {s.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div style={{fontSize:12, color:C.text2, marginBottom:5}}>{s.email}</div>
            <div style={{fontSize:12, color:C.text2, marginBottom:14, fontFamily:'"SF Mono", Consolas, monospace'}}>{s.phone}</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:`1px solid ${C.border}`, gap:10, flexWrap:'wrap'}}>
              <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:8}}>
                <strong style={{color:C.text, fontWeight:700, fontFamily:'"SF Mono", Consolas, monospace'}}>{s.products}</strong> productos
                <span style={{color:C.border}}>·</span>
                <Stars n={s.rating} C={C} />
              </div>
              <div style={{display:'flex', gap:4}}>
                <button style={{...S.btnIcon, color:C.accent2}} onClick={() => openEdit('supplier', s)} aria-label="Editar"
                  onMouseEnter={e => e.currentTarget.style.background = `${C.accent2}20`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Icon.pencil />
                </button>
                <button style={{...S.btnIcon, color:C.red}} onClick={() => delSupplier(s.id)} aria-label="Eliminar"
                  onMouseEnter={e => e.currentTarget.style.background = `${C.red}20`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Icon.trash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Clientes</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{clients.length} clientes registrados</div>
        </div>
        <button style={S.btnPri} onClick={() => openAdd('client')}><Icon.plus /> Agregar cliente</button>
      </div>
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:720}}>
            <thead style={{background:C.bg3}}><tr><TH>Cliente</TH><TH>Email</TH><TH>Teléfono</TH><TH>Compras</TH><TH>Total gastado</TH><TH></TH></tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .12s'}}>
                  <td style={{...TD_BASE, fontWeight:600, color:C.text}}>{c.name}</td>
                  <td style={{...TD_BASE, color:C.text2, fontSize:12}}>{c.email}</td>
                  <td style={{...TD_BASE, color:C.text2, fontSize:12, fontFamily:'"SF Mono", Consolas, monospace'}}>{c.phone}</td>
                  <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, textAlign:'center', color:C.text}}>{c.purchases}</td>
                  <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, color:C.accent, textAlign:'right'}}>${c.total.toLocaleString()}</td>
                  <td style={TD_BASE}>
                    <div style={{display:'flex', gap:4, justifyContent:'flex-end'}}>
                      <button style={S.btnIcon} onClick={() => openEdit('client', c)} aria-label="Editar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.accent2}20`; e.currentTarget.style.color = C.accent2; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent';    e.currentTarget.style.color = C.text2; }}>
                        <Icon.pencil />
                      </button>
                      <button style={S.btnIcon} onClick={() => delClient(c.id)} aria-label="Eliminar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.red}20`; e.currentTarget.style.color = C.red; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}>
                        <Icon.trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="fade-in">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Reportes & Analytics</h1>
        <div style={{fontSize:13, color:C.text2, marginTop:4}}>Análisis de rendimiento del inventario</div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:2, color:C.text}}>Tendencia de ventas</div>
          <div style={{fontSize:12, color:C.text2, marginBottom:14}}>Últimos 6 meses (USD)</div>
          <ResponsiveContainer width="100%" height={195}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="stockArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={C.accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [`$${v.toLocaleString()}`, 'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke={C.accent} strokeWidth={2} fill="url(#stockArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:2, color:C.text}}>Entradas vs Salidas</div>
          <div style={{fontSize:12, color:C.text2, marginBottom:14}}>Movimiento mensual de unidades</div>
          <ResponsiveContainer width="100%" height={195}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
              <Legend wrapperStyle={{fontSize:12}} />
              <Line type="monotone" dataKey="entradas" stroke={C.accent}  strokeWidth={2} dot={{fill:C.accent,  r:4, strokeWidth:0}} name="Entradas" />
              <Line type="monotone" dataKey="salidas"  stroke={C.accent2} strokeWidth={2} dot={{fill:C.accent2, r:4, strokeWidth:0}} name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={S.card}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
          <div style={{fontSize:14, fontWeight:700, color:C.text}}>Top 5 productos por ingresos</div>
          <button style={S.btnGhost} onClick={() => exportCSV(topProducts, 'top_productos')}><Icon.download /> Exportar</button>
        </div>
        <div style={{margin:'0 -20px', overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
            <thead><tr><TH>#</TH><TH>Producto</TH><TH>SKU</TH><TH>Categoría</TH><TH>Ingresos</TH><TH>Margen</TH><TH>Stock</TH></tr></thead>
            <tbody>
              {topProducts.map((p, i) => {
                const margin = p.price > 0 ? Math.round((p.price - p.cost) / p.price * 100) : 0;
                return (
                  <tr key={p.id}>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', color:C.text3, fontWeight:700}}>#{i + 1}</td>
                    <td style={{...TD_BASE, fontWeight:600, color:C.text}}>{p.name}</td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontSize:11, color:C.text2}}>{p.sku}</td>
                    <td style={{...TD_BASE, fontSize:12, color:C.text2}}>{p.category}</td>
                    <td style={{...TD_BASE, fontFamily:'"SF Mono", Consolas, monospace', fontWeight:700, color:C.accent}}>${p.revenue.toLocaleString()}</td>
                    <td style={{...TD_BASE, fontWeight:700, color: margin > 30 ? C.accent : margin > 15 ? C.accent3 : C.red}}>{margin}%</td>
                    <td style={TD_BASE}><StockBadge stock={p.stock} minStock={p.minStock} C={C} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const pageRender = {
    dashboard: renderDashboard,
    inventory: renderInventory,
    sales:     renderSales,
    suppliers: renderSuppliers,
    clients:   renderClients,
    analytics: renderAnalytics,
  }[page] || renderDashboard;

  const navItems = [
    { id:'dashboard', label:'Dashboard',   icon:Icon.grid    },
    { id:'inventory', label:'Inventario',  icon:Icon.box     },
    { id:'sales',     label:'Ventas',      icon:Icon.cart    },
    { id:'suppliers', label:'Proveedores', icon:Icon.factory },
    { id:'clients',   label:'Clientes',    icon:Icon.users   },
    { id:'analytics', label:'Reportes',    icon:Icon.chart   },
  ];

  // Para el modal de venta
  const saleProd  = products.find(p => p.sku === form.sku);
  const saleQty   = +form.qty || 1;
  const saleTotal = saleProd ? saleProd.price * saleQty : 0;

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'product' && (
        <Modal title={editTarget ? 'Editar producto' : 'Agregar producto'} onClose={closeModal} onSave={saveProduct} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Ej: Laptop Dell XPS 13" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>SKU *</label><input style={S.input} value={form.sku||''} onChange={fv('sku')} placeholder="EL-0041" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>Código de barras</label><input style={S.input} value={form.barcode||''} onChange={fv('barcode')} placeholder="7701234567000" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.category||''} onChange={fv('category')} {...focusH}>
                <option value="">Seleccionar...</option>
                {['Electrónica','Hardware','Accesorios','Audio','Almacenamiento','Otro'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Proveedor</label>
              <select style={S.input} value={form.supplier||''} onChange={fv('supplier')} {...focusH}>
                <option value="">Seleccionar...</option>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Precio venta * ($)</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="0" {...focusH} /></div>
            <div><label style={S.label}>Costo ($)</label><input style={S.input} type="number" min="0" value={form.cost||''} onChange={fv('cost')} placeholder="0" {...focusH} /></div>
            <div><label style={S.label}>Stock actual</label><input style={S.input} type="number" min="0" value={form.stock||''} onChange={fv('stock')} placeholder="0" {...focusH} /></div>
            <div><label style={S.label}>Stock mínimo</label><input style={S.input} type="number" min="0" value={form.minStock||''} onChange={fv('minStock')} placeholder="5" {...focusH} /></div>
          </div>
        </Modal>
      )}

      {modal === 'sale' && (
        <Modal title="Registrar venta" onClose={closeModal} onSave={saveSale} saveLabel="Registrar venta" C={C} S={S}>
          <div style={{marginBottom:14}}>
            <label style={S.label}>Producto *</label>
            <select style={S.input} value={form.sku||''} onChange={fv('sku')} {...focusH}>
              <option value="">Seleccionar producto...</option>
              {products.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.sku}>{p.name} — Stock: {p.stock} — ${p.price}</option>)}
            </select>
          </div>
          {saleProd && (
            <div style={{background:C.bg3, borderRadius:8, padding:12, marginBottom:14, fontSize:13, display:'flex', gap:20, flexWrap:'wrap', border:`1px solid ${C.border}`}}>
              <span><span style={{color:C.text2}}>Precio: </span><span style={{color:C.accent, fontWeight:700, fontFamily:'"SF Mono", Consolas, monospace'}}>${saleProd.price}</span></span>
              <span><span style={{color:C.text2}}>Disponible: </span><span style={{fontWeight:700, fontFamily:'"SF Mono", Consolas, monospace'}}>{saleProd.stock} und.</span></span>
            </div>
          )}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            <div><label style={S.label}>Cantidad *</label><input style={S.input} type="number" min="1" max={saleProd?.stock} value={form.qty||''} onChange={fv('qty')} placeholder="1" {...focusH} /></div>
            <div><label style={S.label}>Método de pago</label>
              <select style={S.input} value={form.method||'Efectivo'} onChange={fv('method')} {...focusH}>
                <option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option><option>PSE</option>
              </select>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={S.label}>Cliente</label>
            <select style={S.input} value={form.client||''} onChange={fv('client')} {...focusH}>
              <option value="">Cliente general</option>
              {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          {saleTotal > 0 && (
            <div style={{background:`${C.accent}15`, border:`1px solid ${C.accent}40`, borderRadius:10, padding:18, textAlign:'center'}}>
              <div style={{fontSize:11, color:C.text2, marginBottom:4, letterSpacing:'.4px', textTransform:'uppercase', fontWeight:600}}>Total a cobrar</div>
              <div style={{fontSize:32, fontWeight:800, fontFamily:'"SF Mono", Consolas, monospace', color:C.accent, letterSpacing:'-1px'}}>${saleTotal.toLocaleString()}</div>
            </div>
          )}
        </Modal>
      )}

      {modal === 'supplier' && (
        <Modal title={editTarget ? 'Editar proveedor' : 'Agregar proveedor'} onClose={closeModal} onSave={saveSupplier} C={C} S={S}>
          {[
            ['name',    'Nombre de la empresa *'],
            ['contact', 'Persona de contacto *'],
            ['email',   'Correo electrónico'],
            ['phone',   'Teléfono'],
          ].map(([k, l]) => (
            <div key={k} style={{marginBottom:14}}>
              <label style={S.label}>{l}</label>
              <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} autoComplete="off" {...focusH} />
            </div>
          ))}
          {editTarget && (
            <div>
              <label style={S.label}>Estado</label>
              <select style={S.input} value={form.status||'active'} onChange={fv('status')} {...focusH}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          )}
        </Modal>
      )}

      {modal === 'client' && (
        <Modal title={editTarget ? 'Editar cliente' : 'Agregar cliente'} onClose={closeModal} onSave={saveClient} C={C} S={S}>
          {[
            ['name',  'Nombre completo *'],
            ['email', 'Correo electrónico'],
            ['phone', 'Teléfono'],
          ].map(([k, l]) => (
            <div key={k} style={{marginBottom:14}}>
              <label style={S.label}>{l}</label>
              <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} autoComplete="off" {...focusH} />
            </div>
          ))}
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', inset:0, background:'rgba(10, 14, 20, .7)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:0, maxWidth:400, width:'100%', boxShadow:C.shadowLg, overflow:'hidden'}} onClick={e => e.stopPropagation()}>
            <div style={{padding:24, textAlign:'center'}}>
              <div style={{width:52, height:52, borderRadius:'50%', background:`${C.red}20`, color:C.red, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px'}}>
                {Icon.alert({size:24})}
              </div>
              <div style={{fontSize:16, fontWeight:700, marginBottom:6, color:C.text}}>{confirm.msg}</div>
              <div style={{fontSize:13, color:C.text2}}>Esta acción no se puede deshacer.</div>
            </div>
            <div style={{padding:'14px 24px', background:C.bg3, borderTop:`1px solid ${C.border}`, display:'flex', gap:10, justifyContent:'flex-end'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red, color:'#fff'}} onClick={confirm.onYes}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background:C.bg2, color:C.text, padding:'12px 18px', borderRadius:10, fontSize:14, fontWeight:500, zIndex:1001, boxShadow:C.shadowLg, display:'flex', alignItems:'center', gap:10, borderLeft:`4px solid ${toast.type === 'error' ? C.red : C.accent}`, border:`1px solid ${C.border}`}}>
          <span style={{color: toast.type === 'error' ? C.red : C.accent}}>
            {toast.type === 'error' ? Icon.alert() : Icon.check()}
          </span>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header style={{background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:34, height:34, borderRadius:8, background:C.accent, color:C.accentTxt, display:'flex', alignItems:'center', justifyContent:'center'}}>
            {Icon.package()}
          </div>
          <span style={{fontSize:17, fontWeight:800, letterSpacing:'-.4px', color:C.text}}>Stock<span style={{color:C.accent}}>Pro</span></span>
          <span style={{background:C.accent, color:C.accentTxt, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:100, marginLeft:6, letterSpacing:'.3px'}}>v3.0</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10, position:'relative'}}>
          {(outCount > 0 || lowCount > 0) && (
            <span style={{fontSize:12, background:`${C.red}15`, color:C.red, padding:'5px 12px', borderRadius:100, fontWeight:600, display:'inline-flex', alignItems:'center', gap:6, border:`1px solid ${C.red}30`}}>
              {Icon.alert({size:13})} {outCount + lowCount} alertas
            </span>
          )}
          <button onClick={() => setShowNotifs(s => !s)} aria-label="Notificaciones" style={{background:'transparent', border:'none', color:C.text, cursor:'pointer', position:'relative', padding:8, borderRadius:8, display:'flex'}}>
            {Icon.bell()}
            {notifs.length > 0 && (
              <span style={{position:'absolute', top:4, right:4, background:C.red, color:'#fff', fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:100, minWidth:16, textAlign:'center', lineHeight:1.4}}>{notifs.length}</span>
            )}
          </button>
          {showNotifs && (
            <div style={{position:'absolute', top:46, right:0, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:14, width:300, boxShadow:C.shadowLg, zIndex:50}}>
              <div style={{fontSize:13, fontWeight:700, marginBottom:10, color:C.text}}>Notificaciones ({notifs.length})</div>
              {notifs.length === 0
                ? <div style={{fontSize:12, color:C.text2, textAlign:'center', padding:14}}>No hay notificaciones</div>
                : notifs.slice(0, 5).map(n => (
                    <div key={n.key} style={{display:'flex', gap:10, padding:'10px 0', borderBottom:`1px solid ${C.border}`, fontSize:12}}>
                      <span style={{width:8, height:8, borderRadius:'50%', background: n.type === 'error' ? C.red : C.accent3, marginTop:6, flexShrink:0}} />
                      <div style={{flex:1}}>
                        <div style={{color:C.text}}>{n.text}</div>
                        <div style={{color:C.text3, fontSize:11, marginTop:2}}>{n.time}</div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Cambiar tema" style={{background:'transparent', border:'none', color:C.text, cursor:'pointer', padding:8, borderRadius:8, display:'flex'}}>
            {theme === 'dark' ? Icon.sun() : Icon.moon()}
          </button>
          <div style={{width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent2},${C.accent})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13}}>JM</div>
        </div>
      </header>

      {/* BODY */}
      <div style={{display:'grid', gridTemplateColumns:'212px 1fr'}}>
        <aside style={{background:C.bg2, borderRight:`1px solid ${C.border}`, minHeight:'calc(100vh - 57px)', padding:'18px 0', position:'sticky', top:57, alignSelf:'start'}}>
          <div style={{padding:'0 14px', marginBottom:8}}>
            <div style={{fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:C.text3, textTransform:'uppercase', padding:'0 8px', marginBottom:10}}>Principal</div>
            {navItems.map(({ id, label, icon: NavIcon }) => (
              <div
                key={id}
                onClick={() => { setPage(id); setSearch(''); setCatFilter('all'); }}
                role="button" tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPage(id); } }}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:8, cursor:'pointer',
                  fontSize:13, marginBottom:2,
                  background: page === id ? `${C.accent}14` : 'transparent',
                  color:      page === id ? C.accent : C.text2,
                  fontWeight: page === id ? 700 : 500,
                  transition:'all .12s', userSelect:'none',
                }}
              >
                <NavIcon />
                {label}
                {page === id && <div style={{width:6, height:6, borderRadius:'50%', background:C.accent, marginLeft:'auto'}} />}
              </div>
            ))}
          </div>
          <div style={{margin:'24px 14px', padding:14, background:C.bg3, borderRadius:10, border:`1px solid ${C.border}`}}>
            <div style={{fontSize:11, color:C.text3, marginBottom:6, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>Estado actual</div>
            <div style={{fontSize:28, fontWeight:800, color: outCount + lowCount > 0 ? C.red : C.accent, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px'}}>{outCount + lowCount}</div>
            <div style={{fontSize:11, color:C.text2, marginBottom:10}}>productos críticos</div>
            <button onClick={() => setPage('inventory')} style={{...S.btnGhost, fontSize:11, padding:'6px 12px', width:'100%', justifyContent:'center'}}>
              Ver detalles <Icon.arrowRight />
            </button>
          </div>
        </aside>
        <main style={{padding:'24px 28px', overflowY:'auto'}}>{pageRender()}</main>
      </div>
    </div>
  );
}
