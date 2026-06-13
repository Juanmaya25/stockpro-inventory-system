import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
} from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../icons';
import { Th } from './common/Th';
import { StockBadge } from './common/StockBadge';
import { MONTHLY_DATA } from '../data/seeds';
import { getMargin } from '../utils/inventory';
import { MONO_FONT } from '../styles/theme';

export function Reports({ topProducts, onExport }) {
  const { C, S } = useTheme();
  return (
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
            <AreaChart data={MONTHLY_DATA}>
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
            <LineChart data={MONTHLY_DATA}>
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
          <button style={S.btnGhost} onClick={() => onExport(topProducts, 'top_productos')}><Icon.download /> Exportar</button>
        </div>
        <div style={{margin:'0 -20px', overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
            <thead><tr><Th>#</Th><Th>Producto</Th><Th>SKU</Th><Th>Categoría</Th><Th>Ingresos</Th><Th>Margen</Th><Th>Stock</Th></tr></thead>
            <tbody>
              {topProducts.map((p, i) => {
                const margin = getMargin(p);
                return (
                  <tr key={p.id}>
                    <td style={{...S.td, fontFamily:MONO_FONT, color:C.text3, fontWeight:700}}>#{i + 1}</td>
                    <td style={{...S.td, fontWeight:600, color:C.text}}>{p.name}</td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontSize:11, color:C.text2}}>{p.sku}</td>
                    <td style={{...S.td, fontSize:12, color:C.text2}}>{p.category}</td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontWeight:700, color:C.accent}}>${p.revenue.toLocaleString()}</td>
                    <td style={{...S.td, fontWeight:700, color: margin > 30 ? C.accent : margin > 15 ? C.accent3 : C.red}}>{margin}%</td>
                    <td style={S.td}><StockBadge stock={p.stock} minStock={p.minStock} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
