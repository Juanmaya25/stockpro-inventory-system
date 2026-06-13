import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';
import { MONO_FONT } from '../../styles/theme';

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard',   icon:Icon.grid    },
  { id:'inventory', label:'Inventario',  icon:Icon.box     },
  { id:'sales',     label:'Ventas',      icon:Icon.cart    },
  { id:'suppliers', label:'Proveedores', icon:Icon.factory },
  { id:'clients',   label:'Clientes',    icon:Icon.users   },
  { id:'analytics', label:'Reportes',    icon:Icon.chart   },
];

export function Sidebar({ page, onNavigate, onViewDetails, criticalCount }) {
  const { C, S } = useTheme();
  return (
    <aside style={{background:C.bg2, borderRight:`1px solid ${C.border}`, minHeight:'calc(100vh - 57px)', padding:'18px 0', position:'sticky', top:57, alignSelf:'start'}}>
      <div style={{padding:'0 14px', marginBottom:8}}>
        <div style={{fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:C.text3, textTransform:'uppercase', padding:'0 8px', marginBottom:10}}>Principal</div>
        {NAV_ITEMS.map(({ id, label, icon: NavIcon }) => (
          <div
            key={id}
            onClick={() => onNavigate(id)}
            role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(id); } }}
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
        <div style={{fontSize:28, fontWeight:800, color: criticalCount > 0 ? C.red : C.accent, fontFamily:MONO_FONT, letterSpacing:'-.5px'}}>{criticalCount}</div>
        <div style={{fontSize:11, color:C.text2, marginBottom:10}}>productos críticos</div>
        <button onClick={onViewDetails} style={{...S.btnGhost, fontSize:11, padding:'6px 12px', width:'100%', justifyContent:'center'}}>
          Ver detalles <Icon.arrowRight />
        </button>
      </div>
    </aside>
  );
}
