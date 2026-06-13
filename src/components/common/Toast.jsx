import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';

export function Toast({ toast }) {
  const { C } = useTheme();
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background:C.bg2, color:C.text, padding:'12px 18px', borderRadius:10, fontSize:14, fontWeight:500, zIndex:1001, boxShadow:C.shadowLg, display:'flex', alignItems:'center', gap:10, borderLeft:`4px solid ${toast.type === 'error' ? C.red : C.accent}`, border:`1px solid ${C.border}`}}>
      <span style={{color: toast.type === 'error' ? C.red : C.accent}}>
        {toast.type === 'error' ? Icon.alert() : Icon.check()}
      </span>
      {toast.msg}
    </div>
  );
}
