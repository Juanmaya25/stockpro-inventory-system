import { useTheme } from '../hooks/useTheme';
import { Icon } from '../icons';
import { Th } from './common/Th';
import { MONO_FONT } from '../styles/theme';

export function Clients({ clients, onAdd, onEdit, onDelete }) {
  const { C, S } = useTheme();
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Clientes</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{clients.length} clientes registrados</div>
        </div>
        <button style={S.btnPri} onClick={onAdd}><Icon.plus /> Agregar cliente</button>
      </div>
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:720}}>
            <thead style={{background:C.bg3}}><tr><Th>Cliente</Th><Th>Email</Th><Th>Teléfono</Th><Th>Compras</Th><Th>Total gastado</Th><Th></Th></tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .12s'}}>
                  <td style={{...S.td, fontWeight:600, color:C.text}}>{c.name}</td>
                  <td style={{...S.td, color:C.text2, fontSize:12}}>{c.email}</td>
                  <td style={{...S.td, color:C.text2, fontSize:12, fontFamily:MONO_FONT}}>{c.phone}</td>
                  <td style={{...S.td, fontFamily:MONO_FONT, fontWeight:700, textAlign:'center', color:C.text}}>{c.purchases}</td>
                  <td style={{...S.td, fontFamily:MONO_FONT, fontWeight:700, color:C.accent, textAlign:'right'}}>${c.total.toLocaleString()}</td>
                  <td style={S.td}>
                    <div style={{display:'flex', gap:4, justifyContent:'flex-end'}}>
                      <button style={S.btnIcon} onClick={() => onEdit(c)} aria-label="Editar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.accent2}20`; e.currentTarget.style.color = C.accent2; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent';    e.currentTarget.style.color = C.text2; }}>
                        <Icon.pencil />
                      </button>
                      <button style={S.btnIcon} onClick={() => onDelete(c.id)} aria-label="Eliminar"
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
}
