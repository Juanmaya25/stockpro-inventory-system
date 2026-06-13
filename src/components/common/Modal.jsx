import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';

export function Modal({ title, onClose, onSave, saveLabel = 'Guardar', children, size = 'md' }) {
  const { C, S } = useTheme();
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(10, 14, 20, .7)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:0, width:'100%', maxWidth: size === 'lg' ? 720 : 540, boxShadow:C.shadowLg, overflow:'hidden'}}
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
