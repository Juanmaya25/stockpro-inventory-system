import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';

export function Header({ notifs, showNotifs, onToggleNotifs, outCount, lowCount }) {
  const { C, theme, toggleTheme } = useTheme();
  return (
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
        <button onClick={onToggleNotifs} aria-label="Notificaciones" style={{background:'transparent', border:'none', color:C.text, cursor:'pointer', position:'relative', padding:8, borderRadius:8, display:'flex'}}>
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
        <button onClick={toggleTheme} aria-label="Cambiar tema" style={{background:'transparent', border:'none', color:C.text, cursor:'pointer', padding:8, borderRadius:8, display:'flex'}}>
          {theme === 'dark' ? Icon.sun() : Icon.moon()}
        </button>
        <div style={{width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent2},${C.accent})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13}}>JM</div>
      </div>
    </header>
  );
}
