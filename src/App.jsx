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
  { id:1, date:'2025-04-30', product:'Laptop Dell XPS 13',   sku:'EL-0041', qty:2,  total:2598, client:'Empresa ABC',   method:'Transferencia' },
  { id:2, date:'2025-04-30', product:'Mouse Logitech MX3',   sku:'EL-0088', qty:3,  total:267,  client:'Juan Pérez',    method:'Efectivo' },
  { id:3, date:'2025-04-29', product:'Monitor LG 27"',       sku:'EL-0112', qty:1,  total:349,  client:'Maria López',   method:'Tarjeta' },
  { id:4, date:'2025-04-29', product:'Cable HDMI 2m',        sku:'AC-0201', qty:10, total:120,  client:'TechCorp S.A.', method:'Transferencia' },
  { id:5, date:'2025-04-28', product:'SSD Samsung 1TB',      sku:'ST-0055', qty:3,  total:360,  client:'Carlos Ruiz',   method:'Tarjeta' },
  { id:6, date:'2025-04-28', product:'Auriculares Sony XM5', sku:'AU-0019', qty:2,  total:558,  client:'Digital Store', method:'Transferencia' },
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

const themes = {
  dark:  { bg:'#0d1117', bg2:'#161b27', bg3:'#1e2535', accent:'#00d4aa', accent2:'#4f8ef7', accent3:'#f7a24f', red:'#f05566', purple:'#a78bfa', text:'#e2e8f0', text2:'#64748b', border:'#1e293b' },
  light: { bg:'#f8fafc', bg2:'#ffffff', bg3:'#f1f5f9', accent:'#10b981', accent2:'#3b82f6', accent3:'#f59e0b', red:'#ef4444', purple:'#8b5cf6', text:'#1e293b', text2:'#64748b', border:'#e2e8f0' },
};

const INIT_CAT_DATA = [
  { name:'Electrónica',    value:35, color:'#00d4aa' },
  { name:'Hardware',       value:25, color:'#4f8ef7' },
  { name:'Accesorios',     value:20, color:'#f7a24f' },
  { name:'Audio',          value:12, color:'#f05566' },
  { name:'Almacenamiento', value:8,  color:'#a78bfa' },
];

// ─── COMPONENTES TOP-LEVEL ──────────────────────────────────────────

function KPI({ label, value, sub, color, trend, icon, C, S }) {
  return (
    <div style={{...S.card, borderTop:`2px solid ${color}`, position:'relative', overflow:'hidden'}}>
      {icon && <span style={{position:'absolute', top:14, right:14, fontSize:18, opacity:.3}}>{icon}</span>}
      <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:10}}>{label}</div>
      <div style={{fontSize:22, fontWeight:700, color, fontFamily:'monospace', marginBottom:4}}>{value}</div>
      <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6}}>
        {trend !== undefined && trend !== null && (
          <span style={{color: trend > 0 ? C.accent : C.red, fontWeight:700}}>
            {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}

function StockBadge({ stock, minStock, C }) {
  const s = stock === 0
    ? { l:'Agotado',     bg:`${C.red}20`,     c:C.red }
    : stock <= minStock
      ? { l:'Stock bajo', bg:`${C.accent3}20`, c:C.accent3 }
      : { l:'En stock',   bg:`${C.accent}20`,  c:C.accent };
  return (
    <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background:s.bg, color:s.c, whiteSpace:'nowrap'}}>{s.l}</span>
  );
}

function Stars({ n, C }) {
  return (
    <span>
      <span style={{color:'#f5c842'}}>{'★'.repeat(n)}</span>
      <span style={{color:C.text2}}>{'★'.repeat(5 - n)}</span>
    </span>
  );
}

function Modal({ title, onClose, onSave, saveLabel='Guardar', children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.7)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{...S.card, width:'100%', maxWidth: size==='lg' ? 720 : 540, boxShadow:'0 30px 80px rgba(0,0,0,.6)'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18}}>
          <h2 style={{fontSize:16, fontWeight:700, margin:0, color:C.text}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, fontSize:22, cursor:'pointer', lineHeight:1, padding:0}}>×</button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:22}}>
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
      id: nextId(ss),
      date: new Date().toISOString().split('T')[0],
      product: prod.name,
      sku: prod.sku,
      qty,
      total: prod.price * qty,
      client: form.client || 'Cliente general',
      method: form.method || 'Efectivo',
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
  const monthlySales = useMemo(() => sales.filter(s => s.date.startsWith('2025-04')).reduce((a, s) => a + s.total, 0), [sales]);
  const lowCount     = useMemo(() => products.filter(p => p.stock > 0 && p.stock <= p.minStock).length, [products]);
  const outCount     = useMemo(() => products.filter(p => p.stock === 0).length, [products]);
  const categories   = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  // Notifs DERIVATIVAS via useMemo (no useEffect → más limpio)
  const notifs = useMemo(() => {
    const n = [];
    products.filter(p => p.stock === 0).forEach(p => n.push({ key:`out-${p.id}`, type:'error',   text:`${p.name} está agotado`, time:'hace 2 min' }));
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
    card:     { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:20 },
    input:    { background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 12px', fontSize:13, color:C.text, width:'100%', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
    label:    { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:5, letterSpacing:'.5px', textTransform:'uppercase' },
    btnPri:   { background:C.accent, color: theme === 'dark' ? '#0d1117' : '#fff', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6 },
    btnGhost: { background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnEdit:  { background:`${C.accent2}25`, color:C.accent2, border:'none', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
    btnDel:   { background:`${C.red}20`, color:C.red, border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
  };

  const thStyle = sortKey => ({
    fontSize:11, color:C.text2, fontWeight:600, textAlign:'left',
    padding:'10px 12px', borderBottom:`1px solid ${C.border}`,
    textTransform:'uppercase', letterSpacing:'.3px', whiteSpace:'nowrap',
    cursor: sortKey ? 'pointer' : 'default', userSelect:'none',
  });

  const tdStyle = { padding:'11px 12px', fontSize:13, borderBottom:`1px solid ${C.border}` };

  const TH = ({ children, sortKey }) => (
    <th onClick={sortKey ? () => sortToggle(sortKey) : undefined} style={thStyle(sortKey)}>
      {children}{sortKey === sortBy && <span style={{marginLeft:4, color:C.accent}}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:12}}>
        <div>
          <div style={{fontSize:22, fontWeight:700}}>Dashboard</div>
          <div style={{fontSize:13, color:C.text2, marginTop:2}}>
            Resumen general · {new Date().toLocaleDateString('es-CO', {day:'numeric', month:'long', year:'numeric'})}
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <select style={{...S.input, width:'auto'}} value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button style={S.btnGhost} onClick={() => exportCSV(sales, 'ventas_resumen')}>📥 Exportar</button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginTop:18, marginBottom:20}}>
        <KPI C={C} S={S} label="Productos"        value={products.length}                      sub={`${lowCount} con stock bajo`}                                        color={C.accent}  trend={12} icon="📦" />
        <KPI C={C} S={S} label="Valor inventario" value={`$${totalValue.toLocaleString()}`}    sub="Costo total"                                                          color={C.accent2} trend={8}  icon="💰" />
        <KPI C={C} S={S} label="Ventas del mes"   value={`$${monthlySales.toLocaleString()}`}  sub={`${sales.filter(s => s.date.startsWith('2025-04')).length} transacciones`} color={C.accent3} trend={15} icon="📊" />
        <KPI C={C} S={S} label="Stock crítico"    value={outCount + lowCount}                  sub={`${outCount} agotados`}                                              color={C.red}     trend={-5} icon="⚠️" />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.6fr) minmax(0,1fr)', gap:14, marginBottom:18}}>
        <div style={S.card}>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Movimiento de inventario</div>
            <div style={{fontSize:12, color:C.text2}}>Entradas vs salidas — últimos 6 meses</div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
              <Bar dataKey="entradas" fill={C.accent}  radius={[4, 4, 0, 0]} name="Entradas" />
              <Bar dataKey="salidas"  fill={C.accent2} radius={[4, 4, 0, 0]} name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Por categoría</div>
          <div style={{fontSize:12, color:C.text2, marginBottom:10}}>Distribución actual</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={INIT_CAT_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {INIT_CAT_DATA.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14}}>
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div style={{fontSize:14, fontWeight:700}}>Últimas ventas</div>
            <button onClick={() => setPage('sales')} style={{...S.btnGhost, padding:'5px 12px', fontSize:12}}>Ver todas →</button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:400}}>
              <thead><tr><TH>Producto</TH><TH>Cliente</TH><TH>Total</TH></tr></thead>
              <tbody>
                {sales.slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td style={{...tdStyle, fontWeight:600}}>{s.product}</td>
                    <td style={{...tdStyle, color:C.text2, fontSize:12}}>{s.client}</td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontWeight:700, color:C.accent}}>${s.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Acciones rápidas</div>
          {[
            { label:'➕ Agregar producto',  action: () => { setPage('inventory'); openAdd('product');  }, color:C.accent  },
            { label:'💰 Registrar venta',   action: () => { setPage('sales');     openAdd('sale');     }, color:C.accent2 },
            { label:'🏭 Agregar proveedor', action: () => { setPage('suppliers'); openAdd('supplier'); }, color:C.accent3 },
            { label:'👥 Agregar cliente',   action: () => { setPage('clients');   openAdd('client');   }, color:C.purple  },
          ].map(({ label, action, color }) => (
            <button
              key={label}
              onClick={action}
              style={{display:'block', width:'100%', textAlign:'left', marginBottom:10, background:`${color}14`, color, border:`1px solid ${color}28`, borderRadius:10, padding:'11px 14px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'transform .15s'}}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:12}}>
        <div style={{fontSize:22, fontWeight:700}}>Inventario</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredProducts, 'inventario')}>📥 Exportar CSV</button>
          <button style={S.btnPri}   onClick={() => openAdd('product')}>+ Agregar producto</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:20}}>{filteredProducts.length} de {products.length} productos</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginBottom:18}}>
        <KPI C={C} S={S} label="Total"      value={products.length}                                       sub="Productos"             color={C.accent} />
        <KPI C={C} S={S} label="En stock"   value={products.filter(p => p.stock > p.minStock).length}    sub="Productos"             color="#22c55e" />
        <KPI C={C} S={S} label="Stock bajo" value={lowCount}                                              sub="Requieren atención"    color={C.accent3} />
        <KPI C={C} S={S} label="Agotados"   value={outCount}                                              sub="Productos"             color={C.red} />
      </div>
      <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap'}}>
        <input style={{...S.input, maxWidth:280}} placeholder="🔍 Buscar nombre o SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{...S.input, width:'auto'}} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || catFilter !== 'all') && <button style={S.btnGhost} onClick={() => { setSearch(''); setCatFilter('all'); }}>Limpiar filtros</button>}
      </div>
      <div style={S.card}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:900}}>
            <thead>
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
                    style={{transition:'background .15s'}}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{...tdStyle, fontWeight:600}}>{p.name}</td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontSize:11, color:C.text2}}>{p.sku}</td>
                    <td style={{...tdStyle, fontSize:12, color:C.text2}}>{p.category}</td>
                    <td style={tdStyle}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{width:48, height:5, borderRadius:3, background:C.bg3}}>
                          <div style={{width:`${pct}%`, height:'100%', borderRadius:3, background: p.stock === 0 ? C.red : p.stock <= p.minStock ? C.accent3 : C.accent, transition:'width .3s'}} />
                        </div>
                        <span style={{fontFamily:'monospace', fontWeight:700, fontSize:12}}>{p.stock}</span>
                      </div>
                    </td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontSize:12, color:C.text2}}>{p.minStock}</td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontWeight:700, color:C.accent}}>${p.price}</td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontSize:12, color:C.text2}}>${p.cost}</td>
                    <td style={{...tdStyle, fontWeight:700, color: margin > 30 ? C.accent : margin > 15 ? C.accent3 : C.red}}>{margin}%</td>
                    <td style={tdStyle}><StockBadge stock={p.stock} minStock={p.minStock} C={C} /></td>
                    <td style={tdStyle}>
                      <div style={{display:'flex', gap:6}}>
                        <button style={S.btnEdit} onClick={() => openEdit('product', p)}>✏️</button>
                        <button style={S.btnDel}  onClick={() => delProduct(p.id)}>🗑️</button>
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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:12}}>
        <div style={{fontSize:22, fontWeight:700}}>Ventas</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(sales, 'ventas')}>📥 Exportar</button>
          <button style={S.btnPri}   onClick={() => openAdd('sale')}>+ Registrar venta</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:20}}>{sales.length} transacciones registradas</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginBottom:18}}>
        <KPI C={C} S={S} label="Total acumulado" value={`$${sales.reduce((a, s) => a + s.total, 0).toLocaleString()}`}                                            sub="Todas las ventas" color={C.accent}  />
        <KPI C={C} S={S} label="Este mes"        value={`$${monthlySales.toLocaleString()}`}                                                                       sub="Abril 2025"       color={C.accent2} />
        <KPI C={C} S={S} label="Ticket promedio" value={`$${Math.round(sales.reduce((a, s) => a + s.total, 0) / Math.max(sales.length, 1)).toLocaleString()}`}     sub="Por transacción"  color={C.accent3} />
      </div>
      <div style={S.card}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
            <thead>
              <tr><TH>Fecha</TH><TH>Producto</TH><TH>Cliente</TH><TH>Cantidad</TH><TH>Total</TH><TH>Método</TH><TH></TH></tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .15s'}}>
                  <td style={{...tdStyle, fontFamily:'monospace', fontSize:12, color:C.text2}}>{s.date}</td>
                  <td style={{...tdStyle, fontWeight:600}}>{s.product}</td>
                  <td style={{...tdStyle, color:C.text2, fontSize:12}}>{s.client}</td>
                  <td style={{...tdStyle, fontFamily:'monospace', textAlign:'center', fontWeight:700}}>{s.qty}</td>
                  <td style={{...tdStyle, fontFamily:'monospace', fontWeight:700, color:C.accent}}>${s.total.toLocaleString()}</td>
                  <td style={tdStyle}><span style={{fontSize:11, background:C.bg3, padding:'3px 8px', borderRadius:8, color:C.text2}}>{s.method}</span></td>
                  <td style={tdStyle}><button style={S.btnDel} onClick={() => delSale(s.id)}>🗑️</button></td>
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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:12}}>
        <div style={{fontSize:22, fontWeight:700}}>Proveedores</div>
        <button style={S.btnPri} onClick={() => openAdd('supplier')}>+ Agregar proveedor</button>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:20}}>{suppliers.length} proveedores registrados</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:14}}>
        {suppliers.map(s => (
          <div key={s.id}
            style={{...S.card, borderLeft:`3px solid ${s.status === 'active' ? C.accent : C.red}`, transition:'transform .2s'}}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
              <div>
                <div style={{fontSize:15, fontWeight:700, marginBottom:2}}>{s.name}</div>
                <div style={{fontSize:12, color:C.text2}}>{s.contact}</div>
              </div>
              <span style={{fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:12, background: s.status === 'active' ? `${C.accent}25` : `${C.red}25`, color: s.status === 'active' ? C.accent : C.red}}>
                {s.status === 'active' ? '✓ Activo' : '✕ Inactivo'}
              </span>
            </div>
            <div style={{fontSize:12, color:C.text2, marginBottom:4}}>📧 {s.email}</div>
            <div style={{fontSize:12, color:C.text2, marginBottom:12}}>📞 {s.phone}</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:`1px solid ${C.border}`, gap:10, flexWrap:'wrap'}}>
              <div style={{fontSize:12, color:C.text2}}>
                <span style={{color:C.text, fontWeight:700}}>{s.products}</span> productos · <Stars n={s.rating} C={C} />
              </div>
              <div style={{display:'flex', gap:8}}>
                <button style={S.btnEdit} onClick={() => openEdit('supplier', s)}>✏️ Editar</button>
                <button style={S.btnDel}  onClick={() => delSupplier(s.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:12}}>
        <div style={{fontSize:22, fontWeight:700}}>Clientes</div>
        <button style={S.btnPri} onClick={() => openAdd('client')}>+ Agregar cliente</button>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:20}}>{clients.length} clientes registrados</div>
      <div style={S.card}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
            <thead><tr><TH>Cliente</TH><TH>Email</TH><TH>Teléfono</TH><TH>Compras</TH><TH>Total gastado</TH><TH></TH></tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .15s'}}>
                  <td style={{...tdStyle, fontWeight:600}}>{c.name}</td>
                  <td style={{...tdStyle, color:C.text2, fontSize:12}}>{c.email}</td>
                  <td style={{...tdStyle, color:C.text2, fontSize:12, fontFamily:'monospace'}}>{c.phone}</td>
                  <td style={{...tdStyle, fontFamily:'monospace', fontWeight:700, textAlign:'center'}}>{c.purchases}</td>
                  <td style={{...tdStyle, fontFamily:'monospace', fontWeight:700, color:C.accent}}>${c.total.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <div style={{display:'flex', gap:6}}>
                      <button style={S.btnEdit} onClick={() => openEdit('client', c)}>✏️</button>
                      <button style={S.btnDel}  onClick={() => delClient(c.id)}>🗑️</button>
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
      <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>Reportes & Analytics</div>
      <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Análisis de rendimiento del inventario</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Tendencia de ventas</div>
          <div style={{fontSize:12, color:C.text2, marginBottom:14}}>Últimos 6 meses (USD)</div>
          <ResponsiveContainer width="100%" height={195}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [`$${v.toLocaleString()}`, 'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke={C.accent} strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Entradas vs Salidas</div>
          <div style={{fontSize:12, color:C.text2, marginBottom:14}}>Movimiento mensual de unidades</div>
          <ResponsiveContainer width="100%" height={195}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
              <Legend wrapperStyle={{fontSize:12}} />
              <Line type="monotone" dataKey="entradas" stroke={C.accent}  strokeWidth={2} dot={{fill:C.accent,  r:3}} name="Entradas" />
              <Line type="monotone" dataKey="salidas"  stroke={C.accent2} strokeWidth={2} dot={{fill:C.accent2, r:3}} name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={S.card}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
          <div style={{fontSize:14, fontWeight:700}}>Top 5 productos por ingresos</div>
          <button style={S.btnGhost} onClick={() => exportCSV(topProducts, 'top_productos')}>📥 Exportar</button>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
            <thead>
              <tr><TH>#</TH><TH>Producto</TH><TH>SKU</TH><TH>Categoría</TH><TH>Ingresos</TH><TH>Margen</TH><TH>Stock actual</TH></tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => {
                const margin = p.price > 0 ? Math.round((p.price - p.cost) / p.price * 100) : 0;
                return (
                  <tr key={p.id}>
                    <td style={{...tdStyle, fontFamily:'monospace', color:C.text2, fontWeight:700}}>#{i + 1}</td>
                    <td style={{...tdStyle, fontWeight:600}}>{p.name}</td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontSize:11, color:C.text2}}>{p.sku}</td>
                    <td style={{...tdStyle, fontSize:12, color:C.text2}}>{p.category}</td>
                    <td style={{...tdStyle, fontFamily:'monospace', fontWeight:700, color:C.accent}}>${p.revenue.toLocaleString()}</td>
                    <td style={{...tdStyle, fontWeight:700, color: margin > 30 ? C.accent : margin > 15 ? C.accent3 : C.red}}>{margin}%</td>
                    <td style={tdStyle}><StockBadge stock={p.stock} minStock={p.minStock} C={C} /></td>
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
    { id:'dashboard', label:'Dashboard',   icon:'⊞'  },
    { id:'inventory', label:'Inventario',  icon:'📦' },
    { id:'sales',     label:'Ventas',      icon:'💰' },
    { id:'suppliers', label:'Proveedores', icon:'🏭' },
    { id:'clients',   label:'Clientes',    icon:'👥' },
    { id:'analytics', label:'Reportes',    icon:'📊' },
  ];

  // Para el modal de venta
  const saleProd  = products.find(p => p.sku === form.sku);
  const saleQty   = +form.qty || 1;
  const saleTotal = saleProd ? saleProd.price * saleQty : 0;

  return (
    <div style={{position:'relative', minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:C.text, fontSize:14}}>

      {/* MODAL: PRODUCT */}
      {modal === 'product' && (
        <Modal title={editTarget ? 'Editar producto' : 'Agregar producto'} onClose={closeModal} onSave={saveProduct} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Ej: Laptop Dell XPS 13" autoComplete="off" /></div>
            <div><label style={S.label}>SKU *</label><input style={S.input} value={form.sku||''} onChange={fv('sku')} placeholder="EL-0041" autoComplete="off" /></div>
            <div><label style={S.label}>Código de barras</label><input style={S.input} value={form.barcode||''} onChange={fv('barcode')} placeholder="7701234567000" autoComplete="off" /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.category||''} onChange={fv('category')}>
                <option value="">Seleccionar...</option>
                {['Electrónica','Hardware','Accesorios','Audio','Almacenamiento','Otro'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Proveedor</label>
              <select style={S.input} value={form.supplier||''} onChange={fv('supplier')}>
                <option value="">Seleccionar...</option>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Precio venta * ($)</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="0" /></div>
            <div><label style={S.label}>Costo ($)</label><input style={S.input} type="number" min="0" value={form.cost||''} onChange={fv('cost')} placeholder="0" /></div>
            <div><label style={S.label}>Stock actual</label><input style={S.input} type="number" min="0" value={form.stock||''} onChange={fv('stock')} placeholder="0" /></div>
            <div><label style={S.label}>Stock mínimo</label><input style={S.input} type="number" min="0" value={form.minStock||''} onChange={fv('minStock')} placeholder="5" /></div>
          </div>
        </Modal>
      )}

      {/* MODAL: SALE */}
      {modal === 'sale' && (
        <Modal title="Registrar venta" onClose={closeModal} onSave={saveSale} saveLabel="Registrar venta" C={C} S={S}>
          <div style={{marginBottom:14}}>
            <label style={S.label}>Producto *</label>
            <select style={S.input} value={form.sku||''} onChange={fv('sku')}>
              <option value="">Seleccionar producto...</option>
              {products.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.sku}>{p.name} — Stock: {p.stock} — ${p.price}</option>)}
            </select>
          </div>
          {saleProd && (
            <div style={{background:C.bg3, borderRadius:10, padding:12, marginBottom:14, fontSize:13, display:'flex', gap:20, flexWrap:'wrap'}}>
              <span><span style={{color:C.text2}}>Precio: </span><span style={{color:C.accent, fontWeight:700, fontFamily:'monospace'}}>${saleProd.price}</span></span>
              <span><span style={{color:C.text2}}>Disponible: </span><span style={{fontWeight:700}}>{saleProd.stock} und.</span></span>
            </div>
          )}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            <div><label style={S.label}>Cantidad *</label><input style={S.input} type="number" min="1" max={saleProd?.stock} value={form.qty||''} onChange={fv('qty')} placeholder="1" /></div>
            <div><label style={S.label}>Método de pago</label>
              <select style={S.input} value={form.method||'Efectivo'} onChange={fv('method')}>
                <option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option><option>PSE</option>
              </select>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={S.label}>Cliente</label>
            <select style={S.input} value={form.client||''} onChange={fv('client')}>
              <option value="">Cliente general</option>
              {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          {saleTotal > 0 && (
            <div style={{background:`${C.accent}15`, border:`1px solid ${C.accent}30`, borderRadius:12, padding:16, textAlign:'center'}}>
              <div style={{fontSize:12, color:C.text2, marginBottom:4}}>Total a cobrar</div>
              <div style={{fontSize:32, fontWeight:700, fontFamily:'monospace', color:C.accent}}>${saleTotal.toLocaleString()}</div>
            </div>
          )}
        </Modal>
      )}

      {/* MODAL: SUPPLIER */}
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
              <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} autoComplete="off" />
            </div>
          ))}
          {editTarget && (
            <div>
              <label style={S.label}>Estado</label>
              <select style={S.input} value={form.status||'active'} onChange={fv('status')}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          )}
        </Modal>
      )}

      {/* MODAL: CLIENT */}
      {modal === 'client' && (
        <Modal title={editTarget ? 'Editar cliente' : 'Agregar cliente'} onClose={closeModal} onSave={saveClient} C={C} S={S}>
          {[
            ['name',  'Nombre completo *'],
            ['email', 'Correo electrónico'],
            ['phone', 'Teléfono'],
          ].map(([k, l]) => (
            <div key={k} style={{marginBottom:14}}>
              <label style={S.label}>{l}</label>
              <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} autoComplete="off" />
            </div>
          ))}
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{...S.card, maxWidth:380, textAlign:'center'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:36, marginBottom:14}}>⚠️</div>
            <div style={{fontSize:15, fontWeight:600, marginBottom:20}}>{confirm.msg}</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red, color:'#fff'}} onClick={confirm.onYes}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent, color: theme === 'dark' ? '#0d1117' : '#fff', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:1001, boxShadow:'0 8px 24px rgba(0,0,0,.3)', display:'flex', alignItems:'center', gap:10, animation:'slideUp .3s'}}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:32, height:32, background:C.accent, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17}}>📦</div>
          <span style={{fontSize:16, fontWeight:700}}>Stock<span style={{color:C.accent}}>Pro</span></span>
          <span style={{background:C.accent, color: theme === 'dark' ? '#0d1117' : '#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, marginLeft:6}}>v3.0</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:14, position:'relative'}}>
          {(outCount > 0 || lowCount > 0) && (
            <span style={{fontSize:12, background:`${C.red}15`, color:C.red, padding:'4px 12px', borderRadius:20, fontWeight:600}}>⚠ {outCount + lowCount} alertas</span>
          )}
          <button onClick={() => setShowNotifs(s => !s)} aria-label="Notificaciones" style={{background:'transparent', border:'none', color:C.text, cursor:'pointer', position:'relative', fontSize:18}}>
            🔔
            {notifs.length > 0 && (
              <span style={{position:'absolute', top:-4, right:-4, background:C.red, color:'#fff', fontSize:10, fontWeight:700, padding:'2px 5px', borderRadius:10, minWidth:16, textAlign:'center'}}>{notifs.length}</span>
            )}
          </button>
          {showNotifs && (
            <div style={{position:'absolute', top:36, right:0, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:14, width:300, boxShadow:'0 12px 32px rgba(0,0,0,.3)', zIndex:50}}>
              <div style={{fontSize:13, fontWeight:700, marginBottom:10}}>Notificaciones ({notifs.length})</div>
              {notifs.length === 0
                ? <div style={{fontSize:12, color:C.text2, textAlign:'center', padding:14}}>No hay notificaciones</div>
                : notifs.slice(0, 5).map(n => (
                    <div key={n.key} style={{display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${C.border}`, fontSize:12}}>
                      <span>{n.type === 'error' ? '🔴' : '🟠'}</span>
                      <div style={{flex:1}}>
                        <div>{n.text}</div>
                        <div style={{color:C.text2, fontSize:10, marginTop:2}}>{n.time}</div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Cambiar tema" style={{background:'transparent', border:'none', color:C.text, cursor:'pointer', fontSize:18}}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div style={{width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent2},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff'}}>JM</div>
        </div>
      </div>

      {/* BODY */}
      <div style={{display:'grid', gridTemplateColumns:'200px 1fr'}}>
        <div style={{background:C.bg2, borderRight:`1px solid ${C.border}`, minHeight:'calc(100vh - 57px)', padding:'16px 0', position:'sticky', top:57, alignSelf:'start'}}>
          <div style={{padding:'0 12px', marginBottom:8}}>
            <div style={{fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:C.text2, textTransform:'uppercase', padding:'0 8px', marginBottom:8}}>Principal</div>
            {navItems.map(({ id, label, icon }) => (
              <div
                key={id}
                onClick={() => { setPage(id); setSearch(''); setCatFilter('all'); }}
                role="button" tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPage(id); } }}
                style={{display:'flex', alignItems:'center', gap:10, padding:'10px', borderRadius:8, cursor:'pointer', fontSize:13, marginBottom:2, background: page === id ? `${C.accent}14` : 'transparent', color: page === id ? C.accent : C.text2, fontWeight: page === id ? 600 : 400, transition:'all .15s', userSelect:'none'}}
              >
                <span style={{fontSize:15}}>{icon}</span>{label}
                {page === id && <div style={{width:6, height:6, borderRadius:'50%', background:C.accent, marginLeft:'auto'}} />}
              </div>
            ))}
          </div>
          <div style={{margin:'20px 12px', padding:14, background:C.bg3, borderRadius:10, border:`1px solid ${C.border}`}}>
            <div style={{fontSize:11, color:C.text2, marginBottom:4}}>Estado actual</div>
            <div style={{fontSize:24, fontWeight:700, color: outCount + lowCount > 0 ? C.red : C.accent, fontFamily:'monospace'}}>{outCount + lowCount}</div>
            <div style={{fontSize:11, color:C.text2}}>productos críticos</div>
            <button onClick={() => setPage('inventory')} style={{...S.btnGhost, fontSize:11, padding:'5px 12px', marginTop:8, width:'100%'}}>Ver detalles →</button>
          </div>
        </div>
        <div style={{padding:24, overflowY:'auto'}}>{pageRender()}</div>
      </div>
    </div>
  );
}
