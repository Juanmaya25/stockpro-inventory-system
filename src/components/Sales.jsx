import { useTheme } from '../hooks/useTheme';
import { Icon } from '../icons';
import { Th } from './common/Th';
import { MONO_FONT } from '../styles/theme';

export function Sales({ sales, monthlySales, onExport, onAdd, onDelete }) {
  const { C, S } = useTheme();
  const total = sales.reduce((a, s) => a + s.total, 0);

  const kpis = [
    { l:'Total acumulado', v:`$${total.toLocaleString()}`,        sub:'Todas las ventas', c:C.accent  },
    { l:'Este mes',        v:`$${monthlySales.toLocaleString()}`, sub:'Abril 2026',       c:C.accent2 },
    { l:'Ticket promedio', v:`$${Math.round(total / Math.max(sales.length, 1)).toLocaleString()}`, sub:'Por transacción', c:C.accent3 },
  ];

  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Ventas</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{sales.length} transacciones registradas</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => onExport(sales, 'ventas')}><Icon.download /> Exportar</button>
          <button style={S.btnPri} onClick={onAdd}><Icon.plus /> Registrar venta</button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginBottom:18}}>
        {kpis.map(k => (
          <div key={k.l} style={{...S.card, padding:'16px 18px', borderTop:`2px solid ${k.c}`}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:22, fontWeight:700, color:k.c, fontFamily:MONO_FONT, letterSpacing:'-.5px'}}>{k.v}</div>
            <div style={{fontSize:11, color:C.text3, marginTop:5}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
            <thead style={{background:C.bg3}}><tr><Th>Fecha</Th><Th>Producto</Th><Th>Cliente</Th><Th>Cantidad</Th><Th>Total</Th><Th>Método</Th><Th></Th></tr></thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .12s'}}>
                  <td style={{...S.td, fontFamily:MONO_FONT, fontSize:12, color:C.text2}}>{s.date}</td>
                  <td style={{...S.td, fontWeight:600, color:C.text}}>{s.product}</td>
                  <td style={{...S.td, color:C.text2, fontSize:12}}>{s.client}</td>
                  <td style={{...S.td, fontFamily:MONO_FONT, textAlign:'center', fontWeight:700, color:C.text}}>{s.qty}</td>
                  <td style={{...S.td, fontFamily:MONO_FONT, fontWeight:700, color:C.accent, textAlign:'right'}}>${s.total.toLocaleString()}</td>
                  <td style={S.td}><span style={{fontSize:11, background:C.bg3, padding:'3px 10px', borderRadius:8, color:C.text2, fontWeight:500}}>{s.method}</span></td>
                  <td style={S.td}>
                    <button style={S.btnIcon} onClick={() => onDelete(s.id)} aria-label="Eliminar"
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
}
