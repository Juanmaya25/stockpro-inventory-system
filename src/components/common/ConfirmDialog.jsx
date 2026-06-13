import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';

export function ConfirmDialog({ confirm, onCancel }) {
  const { C, S } = useTheme();
  if (!confirm) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(10, 14, 20, .7)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={onCancel}>
      <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:0, maxWidth:400, width:'100%', boxShadow:C.shadowLg, overflow:'hidden'}} onClick={e => e.stopPropagation()}>
        <div style={{padding:24, textAlign:'center'}}>
          <div style={{width:52, height:52, borderRadius:'50%', background:`${C.red}20`, color:C.red, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px'}}>
            {Icon.alert({size:24})}
          </div>
          <div style={{fontSize:16, fontWeight:700, marginBottom:6, color:C.text}}>{confirm.msg}</div>
          <div style={{fontSize:13, color:C.text2}}>Esta acción no se puede deshacer.</div>
        </div>
        <div style={{padding:'14px 24px', background:C.bg3, borderTop:`1px solid ${C.border}`, display:'flex', gap:10, justifyContent:'flex-end'}}>
          <button style={S.btnGhost} onClick={onCancel}>Cancelar</button>
          <button style={{...S.btnPri, background:C.red, color:'#fff'}} onClick={confirm.onYes}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
