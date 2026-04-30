import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const INIT_PRODUCTS = [
  { id:1, name:'Laptop Dell XPS 13',   sku:'EL-0041', category:'Electrónica',    price:1299, cost:950, stock:36,  minStock:5,  supplier:'TechSupply S.A.' },
  { id:2, name:'Mouse Logitech MX3',   sku:'EL-0088', category:'Electrónica',    price:89,   cost:55,  stock:8,   minStock:10, supplier:'TechSupply S.A.' },
  { id:3, name:'Monitor LG 27"',       sku:'EL-0112', category:'Electrónica',    price:349,  cost:240, stock:22,  minStock:3,  supplier:'LG Colombia' },
  { id:4, name:'Teclado Mecánico',     sku:'HW-0034', category:'Hardware',       price:149,  cost:90,  stock:0,   minStock:5,  supplier:'KeyMasters' },
  { id:5, name:'Cable HDMI 2m',        sku:'AC-0201', category:'Accesorios',     price:12,   cost:5,   stock:145, minStock:20, supplier:'AccesoriosCol' },
  { id:6, name:'SSD Samsung 1TB',      sku:'ST-0055', category:'Almacenamiento', price:120,  cost:80,  stock:14,  minStock:5,  supplier:'Samsung Dist.' },
  { id:7, name:'Auriculares Sony XM5', sku:'AU-0019', category:'Audio',          price:279,  cost:190, stock:7,   minStock:3,  supplier:'Sony Colombia' },
  { id:8, name:'Webcam Logitech C922', sku:'CA-0033', category:'Electrónica',    price:99,   cost:65,  stock:18,  minStock:5,  supplier:'TechSupply S.A.' },
];
const INIT_SALES = [
  { id:1, date:'2025-04-30', product:'Laptop Dell XPS 13',   sku:'EL-0041', qty:2,  total:2598, client:'Empresa ABC',   method:'Transferencia' },
  { id:2, date:'2025-04-30', product:'Mouse Logitech MX3',   sku:'EL-0088', qty:3,  total:267,  client:'Juan Pérez',    method:'Efectivo' },
  { id:3, date:'2025-04-29', product:'Monitor LG 27"',       sku:'EL-0112', qty:1,  total:349,  client:'Maria López',   method:'Tarjeta' },
  { id:4, date:'2025-04-29', product:'Cable HDMI 2m',        sku:'AC-0201', qty:10, total:120,  client:'TechCorp S.A.', method:'Transferencia' },
  { id:5, date:'2025-04-28', product:'SSD Samsung 1TB',      sku:'ST-0055', qty:3,  total:360,  client:'Carlos Ruiz',   method:'Tarjeta' },
  { id:6, date:'2025-04-28', product:'Auriculares Sony XM5', sku:'AU-0019', qty:2,  total:558,  client:'Digital Store',  method:'Transferencia' },
];
const INIT_SUPPLIERS = [
  { id:1, name:'TechSupply S.A.', contact:'Carlos Mendez', email:'cmendez@techsupply.co', phone:'310-555-0101', products:24, status:'active',   rating:5 },
  { id:2, name:'LG Colombia',     contact:'Ana García',    email:'agarcia@lgcol.com',      phone:'310-555-0202', products:8,  status:'active',   rating:4 },
  { id:3, name:'Samsung Dist.',   contact:'Luis Torres',   email:'ltorres@samsungdist.co', phone:'310-555-0303', products:12, status:'active',   rating:5 },
  { id:4, name:'KeyMasters',      contact:'Rosa Jiménez',  email:'rjimenez@keymasters.co', phone:'310-555-0404', products:6,  status:'inactive', rating:3 },
  { id:5, name:'AccesoriosCol',   contact:'Pedro Vargas',  email:'pvargas@accesorios.co',  phone:'310-555-0505', products:35, status:'active',   rating:4 },
  { id:6, name:'Sony Colombia',   contact:'Diana Castro',  email:'dcastro@sonycol.com',    phone:'310-555-0606', products:9,  status:'active',   rating:5 },
];
const monthlyData = [
  { mes:'Nov', entradas:320, salidas:210, ventas:18500 },
  { mes:'Dic', entradas:410, salidas:380, ventas:28000 },
  { mes:'Ene', entradas:280, salidas:190, ventas:15200 },
  { mes:'Feb', entradas:390, salidas:310, ventas:21000 },
  { mes:'Mar', entradas:450, salidas:280, ventas:19800 },
  { mes:'Abr', entradas:520, salidas:390, ventas:23180 },
];
const catData = [
  { name:'Electrónica',    value:35, color:'#00d4aa' },
  { name:'Hardware',       value:25, color:'#4f8ef7' },
  { name:'Accesorios',     value:20, color:'#f7a24f' },
  { name:'Audio',          value:12, color:'#f05566' },
  { name:'Almacenamiento', value:8,  color:'#a78bfa' },
];

const C = { bg:'#0d1117', bg2:'#161b27', bg3:'#1e2535', accent:'#00d4aa', accent2:'#4f8ef7', accent3:'#f7a24f', red:'#f05566', purple:'#a78bfa', text:'#e2e8f0', text2:'#64748b', border:'#1e293b' };
const S = {
  card:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:20 },
  input:   { background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 12px', fontSize:13, color:C.text, width:'100%', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  label:   { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:5, letterSpacing:'.5px', textTransform:'uppercase' },
  btnPri:  { background:C.accent, color:'#0d1117', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' },
  btnGhost:{ background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', fontFamily:'inherit' },
  btnEdit: { background:'rgba(79,142,247,.15)', color:C.accent2, border:'none', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
  btnDel:  { background:'rgba(240,85,102,.12)', color:C.red, border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
};

const KPI = ({ label, value, sub, color }) => (
  <div style={{...S.card, borderTop:`2px solid ${color}`}}>
    <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:10}}>{label}</div>
    <div style={{fontSize:22, fontWeight:700, color, fontFamily:'monospace', marginBottom:4}}>{value}</div>
    <div style={{fontSize:12, color:C.text2}}>{sub}</div>
  </div>
);

const StockBadge = ({ stock, minStock }) => {
  const s = stock===0 ? {l:'Agotado',bg:'rgba(240,85,102,.12)',c:C.red} : stock<=minStock ? {l:'Stock bajo',bg:'rgba(247,162,79,.12)',c:C.accent3} : {l:'En stock',bg:'rgba(0,212,170,.12)',c:C.accent};
  return <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:12,background:s.bg,color:s.c}}>{s.l}</span>;
};

const Stars = ({ n }) => (
  <span><span style={{color:'#f5c842'}}>{'★'.repeat(n)}</span><span style={{color:C.text2}}>{'★'.repeat(5-n)}</span></span>
);

const TH = ({ children }) => (
  <th style={{fontSize:11,color:C.text2,fontWeight:600,textAlign:'left',padding:'8px 10px',borderBottom:`1px solid ${C.border}`,textTransform:'uppercase',letterSpacing:'.3px',whiteSpace:'nowrap'}}>{children}</th>
);
const TD = ({ children, style={} }) => (
  <td style={{padding:'10px',fontSize:13,borderBottom:`1px solid ${C.border}20`,...style}}>{children}</td>
);

const Modal = ({ title, onClose, onSave, saveLabel='Guardar', children }) => (
  <div style={{position:'absolute',top:0,left:0,width:'100%',minHeight:'100%',background:'rgba(0,0,0,.8)',zIndex:999,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'50px 16px'}} onClick={onClose}>
    <div style={{...S.card,width:'100%',maxWidth:540,boxShadow:'0 30px 80px rgba(0,0,0,.6)'}} onClick={e=>e.stopPropagation()}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <h2 style={{fontSize:16,fontWeight:700,margin:0,color:C.text}}>{title}</h2>
        <button onClick={onClose} style={{background:'transparent',border:'none',color:C.text2,fontSize:22,cursor:'pointer',lineHeight:1,padding:0}}>×</button>
      </div>
      {children}
      <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:22}}>
        <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
        <button style={S.btnPri} onClick={onSave}>{saveLabel}</button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [page, setPage]         = useState('dashboard');
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [sales, setSales]       = useState(INIT_SALES);
  const [suppliers, setSuppliers] = useState(INIT_SUPPLIERS);
  const [modal, setModal]       = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]         = useState({});
  const [search, setSearch]     = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [settings, setSettings] = useState({
    company:'StockPro S.A.S.', nit:'900.123.456-7',
    address:'Calle 50 #45-20, Medellín', phone:'310-555-0000',
    email:'admin@stockpro.co', currency:'USD',
    lowStockAlert:true, salesNotify:true,
  });

  const fv = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const sv = k => e => setSettings(s => ({...s, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value}));
  const nextId = arr => (arr.length ? Math.max(...arr.map(x=>x.id)) : 0) + 1;
  const openAdd  = type => { setModal(type); setEditTarget(null); setForm({}); };
  const openEdit = (type, item) => { setModal(type); setEditTarget(item); setForm({...item}); };
  const closeModal = () => { setModal(null); setEditTarget(null); setForm({}); };

  const saveProduct = () => {
    const p = {...form, price:+form.price||0, cost:+form.cost||0, stock:+form.stock||0, minStock:+form.minStock||5};
    if (!editTarget) setProducts(pp => [...pp, {...p, id:nextId(pp)}]);
    else setProducts(pp => pp.map(x => x.id===editTarget.id ? {...x,...p} : x));
    closeModal();
  };
  const delProduct = id => setProducts(pp => pp.filter(x => x.id!==id));

  const saveSale = () => {
    const prod = products.find(p => p.sku===form.sku);
    if (!prod) return;
    const qty = +form.qty || 1;
    setSales(ss => [...ss, { id:nextId(ss), date:new Date().toISOString().split('T')[0], product:prod.name, sku:prod.sku, qty, total:prod.price*qty, client:form.client||'', method:form.method||'Efectivo' }]);
    setProducts(pp => pp.map(p => p.sku===form.sku ? {...p, stock:Math.max(0,p.stock-qty)} : p));
    closeModal();
  };
  const delSale = id => setSales(ss => ss.filter(x => x.id!==id));

  const saveSupplier = () => {
    if (!editTarget) setSuppliers(ss => [...ss, {...form, id:nextId(ss), products:0, status:'active', rating:3}]);
    else setSuppliers(ss => ss.map(x => x.id===editTarget.id ? {...x,...form} : x));
    closeModal();
  };
  const delSupplier = id => setSuppliers(ss => ss.filter(x => x.id!==id));

  const totalValue   = products.reduce((s,p) => s + p.stock*p.cost, 0);
  const monthlySales = sales.filter(s=>s.date.startsWith('2025-04')).reduce((a,s)=>a+s.total,0);
  const lowCount     = products.filter(p=>p.stock>0&&p.stock<=p.minStock).length;
  const outCount     = products.filter(p=>p.stock===0).length;
  const categories   = [...new Set(products.map(p=>p.category))];
  const filtered     = products.filter(p => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)) && (catFilter==='all'||p.category===catFilter);
  });
  const topProducts  = [...products].map(p=>({...p, revenue:sales.filter(s=>s.sku===p.sku).reduce((a,s)=>a+s.total,0)})).sort((a,b)=>b.revenue-a.revenue).slice(0,5);

  const navItems = [
    {id:'dashboard', label:'Dashboard',      icon:'⊞', group:'main'},
    {id:'inventory', label:'Inventario',     icon:'📦', group:'main'},
    {id:'sales',     label:'Ventas',         icon:'💰', group:'main'},
    {id:'suppliers', label:'Proveedores',    icon:'🏭', group:'main'},
    {id:'analytics', label:'Reportes',       icon:'📊', group:'extra'},
    {id:'settings',  label:'Configuración',  icon:'⚙',  group:'extra'},
  ];

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  const PageDashboard = () => (
    <div>
      <div style={{fontSize:22,fontWeight:700,marginBottom:4}}>Dashboard</div>
      <div style={{fontSize:13,color:C.text2,marginBottom:22}}>Resumen general del almacén — Abril 2025</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:22}}>
        <KPI label="Productos" value={products.length} sub={`${lowCount} con stock bajo`} color={C.accent} />
        <KPI label="Valor inventario" value={`$${totalValue.toLocaleString()}`} sub="En precio de costo" color={C.accent2} />
        <KPI label="Ventas del mes" value={`$${monthlySales.toLocaleString()}`} sub={`${sales.filter(s=>s.date.startsWith('2025-04')).length} transacciones`} color={C.accent3} />
        <KPI label="Stock crítico" value={outCount+lowCount} sub={`${outCount} agotados · ${lowCount} bajos`} color={C.red} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:14,marginBottom:18}}>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>Movimiento de inventario</div>
          <div style={{fontSize:12,color:C.text2,marginBottom:14}}>Entradas vs salidas — últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11,fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} />
              <Bar dataKey="entradas" fill={C.accent}  radius={[4,4,0,0]} name="Entradas" />
              <Bar dataKey="salidas"  fill={C.accent2} radius={[4,4,0,0]} name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:'flex',gap:20,marginTop:10}}>
            {[[C.accent,'Entradas'],[C.accent2,'Salidas']].map(([c,l])=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:C.text2}}>
                <span style={{width:10,height:10,borderRadius:2,background:c,display:'inline-block'}}></span>{l}
              </span>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>Por categoría</div>
          <div style={{fontSize:12,color:C.text2,marginBottom:10}}>Distribución de productos</div>
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                {catData.map((e,i)=><Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginTop:6}}>
            {catData.map(d=>(
              <span key={d.name} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.text2}}>
                <span style={{width:8,height:8,borderRadius:2,background:d.color,display:'inline-block',flexShrink:0}}></span>{d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14}}>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Últimas ventas</div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><TH>Producto</TH><TH>Cliente</TH><TH>Total</TH><TH>Método</TH></tr></thead>
            <tbody>
              {sales.slice(0,5).map(s=>(
                <tr key={s.id}>
                  <TD style={{fontWeight:600}}>{s.product}</TD>
                  <TD style={{color:C.text2,fontSize:12}}>{s.client}</TD>
                  <TD style={{fontFamily:'monospace',fontWeight:700,color:C.accent}}>${s.total.toLocaleString()}</TD>
                  <TD><span style={{fontSize:11,background:C.bg3,padding:'3px 8px',borderRadius:8,color:C.text2}}>{s.method}</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Acciones rápidas</div>
          {[
            {label:'Agregar producto',  action:()=>{setPage('inventory');openAdd('product');},  color:C.accent},
            {label:'Registrar venta',   action:()=>{setPage('sales');openAdd('sale');},          color:C.accent2},
            {label:'Agregar proveedor', action:()=>{setPage('suppliers');openAdd('supplier');},  color:C.accent3},
            {label:'Ver reportes',      action:()=>setPage('analytics'),                          color:C.purple},
          ].map(({label,action,color})=>(
            <button key={label} onClick={action} style={{display:'block',width:'100%',textAlign:'left',marginBottom:10,background:`${color}14`,color,border:`1px solid ${color}28`,borderRadius:10,padding:'11px 14px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
              → {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── INVENTORY ────────────────────────────────────────────────────────────
  const PageInventory = () => (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
        <div style={{fontSize:22,fontWeight:700}}>Inventario</div>
        <button style={S.btnPri} onClick={()=>openAdd('product')}>+ Agregar producto</button>
      </div>
      <div style={{fontSize:13,color:C.text2,marginBottom:20}}>{products.length} productos registrados</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPI label="Total"      value={products.length}                                      sub="Productos"  color={C.accent} />
        <KPI label="En stock"   value={products.filter(p=>p.stock>p.minStock).length}         sub="Productos"  color="#22c55e" />
        <KPI label="Stock bajo" value={lowCount}                                              sub="Productos"  color={C.accent3} />
        <KPI label="Agotados"   value={outCount}                                              sub="Productos"  color={C.red} />
      </div>
      <div style={{display:'flex',gap:10,marginBottom:14}}>
        <input style={{...S.input,maxWidth:280}} placeholder="🔍  Buscar nombre o SKU..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={{...S.input,width:'auto'}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={S.card}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><TH>Producto</TH><TH>SKU</TH><TH>Categoría</TH><TH>Stock</TH><TH>Mín</TH><TH>Precio</TH><TH>Costo</TH><TH>Margen</TH><TH>Estado</TH><TH></TH></tr></thead>
          <tbody>
            {filtered.map(p => {
              const margin = p.price>0 ? Math.round((p.price-p.cost)/p.price*100) : 0;
              const pct = Math.min(100, Math.round(p.stock/Math.max(p.minStock*3,1)*100));
              return (
                <tr key={p.id}>
                  <TD style={{fontWeight:600}}>{p.name}</TD>
                  <TD style={{fontFamily:'monospace',fontSize:11,color:C.text2}}>{p.sku}</TD>
                  <TD style={{fontSize:12,color:C.text2}}>{p.category}</TD>
                  <TD>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:48,height:5,borderRadius:3,background:C.bg3}}>
                        <div style={{width:`${pct}%`,height:'100%',borderRadius:3,background:p.stock===0?C.red:p.stock<=p.minStock?C.accent3:C.accent}}></div>
                      </div>
                      <span style={{fontFamily:'monospace',fontWeight:700,fontSize:12}}>{p.stock}</span>
                    </div>
                  </TD>
                  <TD style={{fontFamily:'monospace',fontSize:12,color:C.text2}}>{p.minStock}</TD>
                  <TD style={{fontFamily:'monospace',fontWeight:700,color:C.accent}}>${p.price}</TD>
                  <TD style={{fontFamily:'monospace',fontSize:12,color:C.text2}}>${p.cost}</TD>
                  <TD style={{fontWeight:700,color:margin>30?C.accent:margin>15?C.accent3:C.red}}>{margin}%</TD>
                  <TD><StockBadge stock={p.stock} minStock={p.minStock} /></TD>
                  <TD>
                    <div style={{display:'flex',gap:6}}>
                      <button style={S.btnEdit} onClick={()=>openEdit('product',p)}>Editar</button>
                      <button style={S.btnDel}  onClick={()=>delProduct(p.id)}>✕</button>
                    </div>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── SALES ────────────────────────────────────────────────────────────────
  const PageSales = () => (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
        <div style={{fontSize:22,fontWeight:700}}>Ventas</div>
        <button style={S.btnPri} onClick={()=>openAdd('sale')}>+ Registrar venta</button>
      </div>
      <div style={{fontSize:13,color:C.text2,marginBottom:20}}>{sales.length} transacciones registradas</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
        <KPI label="Total acumulado" value={`$${sales.reduce((a,s)=>a+s.total,0).toLocaleString()}`} sub="Todas las ventas" color={C.accent} />
        <KPI label="Este mes"        value={`$${monthlySales.toLocaleString()}`}                     sub="Abril 2025"     color={C.accent2} />
        <KPI label="Ticket promedio" value={`$${Math.round(sales.reduce((a,s)=>a+s.total,0)/Math.max(sales.length,1)).toLocaleString()}`} sub="Por transacción" color={C.accent3} />
      </div>
      <div style={S.card}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><TH>Fecha</TH><TH>Producto</TH><TH>Cliente</TH><TH>Qty</TH><TH>Total</TH><TH>Método</TH><TH></TH></tr></thead>
          <tbody>
            {sales.map(s=>(
              <tr key={s.id}>
                <TD style={{fontFamily:'monospace',fontSize:12,color:C.text2}}>{s.date}</TD>
                <TD style={{fontWeight:600}}>{s.product}</TD>
                <TD style={{color:C.text2,fontSize:12}}>{s.client}</TD>
                <TD style={{fontFamily:'monospace',textAlign:'center',fontWeight:700}}>{s.qty}</TD>
                <TD style={{fontFamily:'monospace',fontWeight:700,color:C.accent}}>${s.total.toLocaleString()}</TD>
                <TD><span style={{fontSize:11,background:C.bg3,padding:'3px 8px',borderRadius:8,color:C.text2}}>{s.method}</span></TD>
                <TD><button style={S.btnDel} onClick={()=>delSale(s.id)}>✕</button></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── SUPPLIERS ────────────────────────────────────────────────────────────
  const PageSuppliers = () => (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
        <div style={{fontSize:22,fontWeight:700}}>Proveedores</div>
        <button style={S.btnPri} onClick={()=>openAdd('supplier')}>+ Agregar proveedor</button>
      </div>
      <div style={{fontSize:13,color:C.text2,marginBottom:20}}>{suppliers.length} proveedores registrados</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
        <KPI label="Total"    value={suppliers.length}                                  sub="Proveedores" color={C.accent} />
        <KPI label="Activos"  value={suppliers.filter(s=>s.status==='active').length}   sub="Proveedores" color={C.accent2} />
        <KPI label="Inactivos" value={suppliers.filter(s=>s.status==='inactive').length} sub="Proveedores" color={C.red} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {suppliers.map(s=>(
          <div key={s.id} style={{...S.card,borderLeft:`3px solid ${s.status==='active'?C.accent:C.red}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{s.name}</div>
                <div style={{fontSize:12,color:C.text2}}>{s.contact}</div>
              </div>
              <span style={{fontSize:11,fontWeight:600,padding:'3px 8px',borderRadius:12,background:s.status==='active'?'rgba(0,212,170,.12)':'rgba(240,85,102,.12)',color:s.status==='active'?C.accent:C.red}}>
                {s.status==='active'?'Activo':'Inactivo'}
              </span>
            </div>
            <div style={{fontSize:12,color:C.text2,marginBottom:4}}>📧 {s.email}</div>
            <div style={{fontSize:12,color:C.text2,marginBottom:12}}>📞 {s.phone}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:12,color:C.text2}}><span style={{color:C.text,fontWeight:700}}>{s.products}</span> productos · <Stars n={s.rating} /></div>
              <div style={{display:'flex',gap:8}}>
                <button style={S.btnEdit} onClick={()=>openEdit('supplier',s)}>Editar</button>
                <button style={S.btnDel}  onClick={()=>delSupplier(s.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── ANALYTICS ────────────────────────────────────────────────────────────
  const PageAnalytics = () => (
    <div>
      <div style={{fontSize:22,fontWeight:700,marginBottom:4}}>Reportes & Analytics</div>
      <div style={{fontSize:13,color:C.text2,marginBottom:22}}>Análisis de rendimiento del inventario</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>Tendencia de ventas</div>
          <div style={{fontSize:12,color:C.text2,marginBottom:14}}>Últimos 6 meses (USD)</div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11,fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} formatter={v=>[`$${v.toLocaleString()}`,'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke={C.accent} strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>Entradas vs Salidas</div>
          <div style={{fontSize:12,color:C.text2,marginBottom:14}}>Movimiento mensual de unidades</div>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11,fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} />
              <Line type="monotone" dataKey="entradas" stroke={C.accent}  strokeWidth={2} dot={{fill:C.accent, r:3}}  name="Entradas" />
              <Line type="monotone" dataKey="salidas"  stroke={C.accent2} strokeWidth={2} dot={{fill:C.accent2,r:3}} name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={S.card}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Top 5 productos por ingresos generados</div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><TH>#</TH><TH>Producto</TH><TH>SKU</TH><TH>Categoría</TH><TH>Ingresos</TH><TH>Margen</TH><TH>Stock actual</TH></tr></thead>
          <tbody>
            {topProducts.map((p,i)=>{
              const margin = Math.round((p.price-p.cost)/p.price*100);
              return (
                <tr key={p.id}>
                  <TD style={{fontFamily:'monospace',color:C.text2}}>#{i+1}</TD>
                  <TD style={{fontWeight:600}}>{p.name}</TD>
                  <TD style={{fontFamily:'monospace',fontSize:11,color:C.text2}}>{p.sku}</TD>
                  <TD style={{fontSize:12,color:C.text2}}>{p.category}</TD>
                  <TD style={{fontFamily:'monospace',fontWeight:700,color:C.accent}}>${p.revenue.toLocaleString()}</TD>
                  <TD style={{fontWeight:700,color:margin>30?C.accent:margin>15?C.accent3:C.red}}>{margin}%</TD>
                  <TD><StockBadge stock={p.stock} minStock={p.minStock} /></TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  const PageSettings = () => (
    <div>
      <div style={{fontSize:22,fontWeight:700,marginBottom:4}}>Configuración</div>
      <div style={{fontSize:13,color:C.text2,marginBottom:22}}>Información de la empresa y preferencias del sistema</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={S.card}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Información de la empresa</div>
          {[['company','Nombre de la empresa'],['nit','NIT / RUT'],['address','Dirección'],['phone','Teléfono'],['email','Correo electrónico']].map(([k,l])=>(
            <div key={k} style={{marginBottom:14}}>
              <label style={S.label}>{l}</label>
              <input style={S.input} value={settings[k]} onChange={sv(k)} />
            </div>
          ))}
          <div style={{marginBottom:18}}>
            <label style={S.label}>Moneda del sistema</label>
            <select style={S.input} value={settings.currency} onChange={sv('currency')}>
              <option value="USD">USD — Dólar americano</option>
              <option value="COP">COP — Peso colombiano</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
          <button style={S.btnPri} onClick={()=>alert('✅ Cambios guardados correctamente')}>Guardar cambios</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={S.card}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Notificaciones</div>
            {[['lowStockAlert','Alertas de stock bajo'],['salesNotify','Notificaciones de ventas']].map(([k,l])=>(
              <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <span style={{fontSize:13}}>{l}</span>
                <div onClick={()=>setSettings(s=>({...s,[k]:!s[k]}))} style={{width:42,height:23,borderRadius:12,background:settings[k]?C.accent:C.bg3,cursor:'pointer',position:'relative',transition:'background .2s',border:`1px solid ${C.border}`,flexShrink:0}}>
                  <div style={{position:'absolute',top:3,left:settings[k]?20:3,width:15,height:15,borderRadius:'50%',background:'white',transition:'left .2s'}}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Resumen del sistema</div>
            {[['Versión','StockPro v2.4.1'],['Productos',products.length],['Ventas',sales.length],['Proveedores',suppliers.length],['Valor inventario',`$${totalValue.toLocaleString()}`]].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.border}20`,fontSize:13}}>
                <span style={{color:C.text2}}>{l}</span>
                <span style={{fontWeight:600,fontFamily:'monospace'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── MODALS ───────────────────────────────────────────────────────────────
  const ModalProduct = () => (
    <Modal title={editTarget?'Editar producto':'Agregar producto'} onClose={closeModal} onSave={saveProduct}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={{gridColumn:'1/-1'}}>
          <label style={S.label}>Nombre del producto</label>
          <input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Ej: Laptop Dell XPS 13" />
        </div>
        <div>
          <label style={S.label}>SKU / Código</label>
          <input style={S.input} value={form.sku||''} onChange={fv('sku')} placeholder="Ej: EL-0041" />
        </div>
        <div>
          <label style={S.label}>Categoría</label>
          <select style={S.input} value={form.category||''} onChange={fv('category')}>
            <option value="">Seleccionar...</option>
            {['Electrónica','Hardware','Accesorios','Audio','Almacenamiento','Otro'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Proveedor</label>
          <select style={S.input} value={form.supplier||''} onChange={fv('supplier')}>
            <option value="">Seleccionar...</option>
            {suppliers.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Precio de venta ($)</label>
          <input style={S.input} type="number" value={form.price||''} onChange={fv('price')} placeholder="0" min="0" />
        </div>
        <div>
          <label style={S.label}>Costo ($)</label>
          <input style={S.input} type="number" value={form.cost||''} onChange={fv('cost')} placeholder="0" min="0" />
        </div>
        <div>
          <label style={S.label}>Stock actual</label>
          <input style={S.input} type="number" value={form.stock||''} onChange={fv('stock')} placeholder="0" min="0" />
        </div>
        <div>
          <label style={S.label}>Stock mínimo</label>
          <input style={S.input} type="number" value={form.minStock||''} onChange={fv('minStock')} placeholder="5" min="0" />
        </div>
      </div>
    </Modal>
  );

  const ModalSale = () => {
    const prod = products.find(p=>p.sku===form.sku);
    const qty  = +form.qty||1;
    const total = prod ? prod.price*qty : 0;
    return (
      <Modal title="Registrar venta" onClose={closeModal} onSave={saveSale} saveLabel="Registrar venta">
        <div style={{marginBottom:14}}>
          <label style={S.label}>Producto</label>
          <select style={S.input} value={form.sku||''} onChange={fv('sku')}>
            <option value="">Seleccionar producto...</option>
            {products.filter(p=>p.stock>0).map(p=><option key={p.id} value={p.sku}>{p.name} — Stock: {p.stock} — ${p.price}</option>)}
          </select>
        </div>
        {prod && <div style={{background:C.bg3,borderRadius:10,padding:12,marginBottom:14,fontSize:13,display:'flex',gap:20}}>
          <span><span style={{color:C.text2}}>Precio: </span><span style={{color:C.accent,fontWeight:700,fontFamily:'monospace'}}>${prod.price}</span></span>
          <span><span style={{color:C.text2}}>Disponible: </span><span style={{fontWeight:700}}>{prod.stock} und.</span></span>
        </div>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
          <div>
            <label style={S.label}>Cantidad</label>
            <input style={S.input} type="number" value={form.qty||''} onChange={fv('qty')} placeholder="1" min="1" max={prod?.stock} />
          </div>
          <div>
            <label style={S.label}>Método de pago</label>
            <select style={S.input} value={form.method||'Efectivo'} onChange={fv('method')}>
              <option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option>
            </select>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={S.label}>Nombre del cliente</label>
          <input style={S.input} value={form.client||''} onChange={fv('client')} placeholder="Ej: Empresa ABC" />
        </div>
        {total>0 && <div style={{background:`${C.accent}12`,border:`1px solid ${C.accent}25`,borderRadius:12,padding:16,textAlign:'center'}}>
          <div style={{fontSize:12,color:C.text2,marginBottom:4}}>Total a cobrar</div>
          <div style={{fontSize:30,fontWeight:700,fontFamily:'monospace',color:C.accent}}>${total.toLocaleString()}</div>
        </div>}
      </Modal>
    );
  };

  const ModalSupplier = () => (
    <Modal title={editTarget?'Editar proveedor':'Agregar proveedor'} onClose={closeModal} onSave={saveSupplier}>
      {[['name','Nombre de la empresa'],['contact','Persona de contacto'],['email','Correo electrónico'],['phone','Teléfono']].map(([k,l])=>(
        <div key={k} style={{marginBottom:14}}>
          <label style={S.label}>{l}</label>
          <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} />
        </div>
      ))}
      {editTarget && <div>
        <label style={S.label}>Estado</label>
        <select style={S.input} value={form.status||'active'} onChange={fv('status')}>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>}
    </Modal>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  const pages = { dashboard:<PageDashboard/>, inventory:<PageInventory/>, sales:<PageSales/>, suppliers:<PageSuppliers/>, analytics:<PageAnalytics/>, settings:<PageSettings/> };

  return (
    <div style={{position:'relative',minHeight:'100vh',background:C.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:C.text,fontSize:14}}>

      {modal==='product'  && <ModalProduct />}
      {modal==='sale'     && <ModalSale />}
      {modal==='supplier' && <ModalSupplier />}

      {/* HEADER */}
      <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,background:C.accent,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>📦</div>
          <span style={{fontSize:16,fontWeight:700}}>Stock<span style={{color:C.accent}}>Pro</span></span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          {outCount>0 && <span style={{fontSize:12,background:'rgba(240,85,102,.15)',color:C.red,padding:'4px 12px',borderRadius:20,fontWeight:600}}>⚠ {outCount} agotados</span>}
          <span style={{background:C.accent,color:'#0d1117',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20}}>v2.4.1</span>
          <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${C.accent2},${C.accent})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#0d1117'}}>JM</div>
        </div>
      </div>

      {/* BODY */}
      <div style={{display:'grid',gridTemplateColumns:'190px 1fr'}}>
        {/* SIDEBAR */}
        <div style={{background:C.bg2,borderRight:`1px solid ${C.border}`,minHeight:'calc(100vh - 57px)',padding:'16px 0',position:'sticky',top:57,alignSelf:'start'}}>
          <div style={{padding:'0 12px',marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',color:C.text2,textTransform:'uppercase',padding:'0 8px',marginBottom:8}}>Principal</div>
            {navItems.filter(n=>n.group==='main').map(({id,label,icon})=>(
              <div key={id} onClick={()=>{setPage(id);setSearch('');setCatFilter('all');}}
                style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:8,cursor:'pointer',fontSize:13,marginBottom:2,background:page===id?`${C.accent}14`:'transparent',color:page===id?C.accent:C.text2,fontWeight:page===id?600:400,transition:'all .15s'}}>
                <span style={{fontSize:15}}>{icon}</span>{label}
                {page===id && <div style={{width:6,height:6,borderRadius:'50%',background:C.accent,marginLeft:'auto'}}></div>}
              </div>
            ))}
          </div>
          <div style={{padding:'8px 12px 0',marginTop:8,borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',color:C.text2,textTransform:'uppercase',padding:'8px 8px 8px',marginBottom:2}}>Análisis</div>
            {navItems.filter(n=>n.group==='extra').map(({id,label,icon})=>(
              <div key={id} onClick={()=>setPage(id)}
                style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:8,cursor:'pointer',fontSize:13,marginBottom:2,background:page===id?`${C.accent}14`:'transparent',color:page===id?C.accent:C.text2,fontWeight:page===id?600:400,transition:'all .15s'}}>
                <span style={{fontSize:15}}>{icon}</span>{label}
                {page===id && <div style={{width:6,height:6,borderRadius:'50%',background:C.accent,marginLeft:'auto'}}></div>}
              </div>
            ))}
          </div>
          <div style={{margin:'20px 12px 0',padding:14,background:C.bg3,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.text2,marginBottom:4}}>Crítico ahora</div>
            <div style={{fontSize:26,fontWeight:700,color:outCount+lowCount>0?C.red:C.accent,fontFamily:'monospace'}}>{outCount+lowCount}</div>
            <div style={{fontSize:11,color:C.text2}}>productos requieren atención</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{padding:24}}>{pages[page]}</div>
      </div>
    </div>
  );
}
