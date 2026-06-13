import { useTheme } from '../hooks/useTheme';
import { Icon } from '../icons';
import { Stars } from './common/Stars';
import { MONO_FONT } from '../styles/theme';

export function Suppliers({ suppliers, onAdd, onEdit, onDelete }) {
  const { C, S } = useTheme();
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Proveedores</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{suppliers.length} proveedores registrados</div>
        </div>
        <button style={S.btnPri} onClick={onAdd}><Icon.plus /> Agregar proveedor</button>
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
            <div style={{fontSize:12, color:C.text2, marginBottom:14, fontFamily:MONO_FONT}}>{s.phone}</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:`1px solid ${C.border}`, gap:10, flexWrap:'wrap'}}>
              <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:8}}>
                <strong style={{color:C.text, fontWeight:700, fontFamily:MONO_FONT}}>{s.products}</strong> productos
                <span style={{color:C.border}}>·</span>
                <Stars n={s.rating} />
              </div>
              <div style={{display:'flex', gap:4}}>
                <button style={{...S.btnIcon, color:C.accent2}} onClick={() => onEdit(s)} aria-label="Editar"
                  onMouseEnter={e => e.currentTarget.style.background = `${C.accent2}20`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Icon.pencil />
                </button>
                <button style={{...S.btnIcon, color:C.red}} onClick={() => onDelete(s.id)} aria-label="Eliminar"
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
}
