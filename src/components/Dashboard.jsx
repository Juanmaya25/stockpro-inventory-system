import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../icons';
import { Th } from './common/Th';
import { MONTHLY_DATA, INIT_CAT_DATA, CURRENT_MONTH } from '../data/seeds';
import { getSalesForMonth } from '../utils/inventory';
import { MONO_FONT } from '../styles/theme';

export function Dashboard({
  products, sales, totalValue, monthlySales, lowCount, outCount,
  dateRange, onDateRangeChange, onExport, onNavigate, onQuickAdd,
}) {
  const { C, S } = useTheme();

  const kpis = [
    { l:'Productos',        v:products.length,                     sub:`${lowCount} con stock bajo`, c:C.accent,  trend:12 },
    { l:'Valor inventario', v:`$${totalValue.toLocaleString()}`,   sub:'Costo total',                c:C.accent2, trend:8  },
    { l:'Ventas del mes',   v:`$${monthlySales.toLocaleString()}`, sub:`${getSalesForMonth(sales, CURRENT_MONTH).length} transacciones`, c:C.accent3, trend:15 },
    { l:'Stock crítico',    v:outCount + lowCount,                 sub:`${outCount} agotados`,       c:C.red,     trend:-5 },
  ];

  const quickActions = [
    { label:'Agregar producto',  icon:Icon.box,     action: () => onQuickAdd('inventory', 'product'),  color:C.accent  },
    { label:'Registrar venta',   icon:Icon.cart,    action: () => onQuickAdd('sales',     'sale'),     color:C.accent2 },
    { label:'Agregar proveedor', icon:Icon.factory, action: () => onQuickAdd('suppliers', 'supplier'), color:C.accent3 },
    { label:'Agregar cliente',   icon:Icon.users,   action: () => onQuickAdd('clients',   'client'),   color:C.purple  },
  ];

  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Dashboard</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>
            {new Date().toLocaleDateString('es-CO', {day:'numeric', month:'long', year:'numeric'})}
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <select style={{...S.input, width:'auto'}} value={dateRange} onChange={e => onDateRangeChange(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button style={S.btnGhost} onClick={() => onExport(sales, 'ventas_resumen')}>
            <Icon.download /> Exportar
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:18}}>
        {kpis.map(k => (
          <div key={k.l} style={{...S.card, borderTop:`2px solid ${k.c}`, position:'relative'}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:10}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:700, color:k.c, fontFamily:MONO_FONT, letterSpacing:'-.5px', marginBottom:8}}>{k.v}</div>
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
            <BarChart data={MONTHLY_DATA} barGap={4}>
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
            <button onClick={() => onNavigate('sales')} style={{...S.btnGhost, padding:'6px 12px', fontSize:12}}>Ver todas <Icon.arrowRight /></button>
          </div>
          <div style={{margin:'0 -20px', overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead><tr><Th>Producto</Th><Th>Cliente</Th><Th>Total</Th></tr></thead>
              <tbody>
                {sales.slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td style={{...S.td, fontWeight:600, color:C.text}}>{s.product}</td>
                    <td style={{...S.td, color:C.text2, fontSize:12}}>{s.client}</td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontWeight:700, color:C.accent, textAlign:'right'}}>${s.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14, color:C.text}}>Acciones rápidas</div>
          {quickActions.map(a => (
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
}
