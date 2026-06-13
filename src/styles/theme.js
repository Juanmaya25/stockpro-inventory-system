// PALETTE: SaaS B2B refinado — verde neón sobre fondo oscuro / blanco crujiente en light
export const themes = {
  dark: {
    bg:        '#0a0e14',
    bg2:       '#0f1419',
    bg3:       '#161c24',
    accent:    '#00d4aa',
    accent2:   '#4f8ef7',
    accent3:   '#f7a24f',
    red:       '#f05566',
    purple:    '#a78bfa',
    text:      '#e2e8f0',
    text2:     '#94a3b8',
    text3:     '#64748b',
    border:    '#1e293b',
    borderLite:'#2d3a4f',
    accentTxt: '#0a0e14',  // texto sobre accent
    shadow:    '0 1px 3px rgba(0,0,0,.3)',
    shadowLg:  '0 12px 40px rgba(0, 212, 170, .15)',
  },
  light: {
    bg:        '#f8fafc',
    bg2:       '#ffffff',
    bg3:       '#f1f5f9',
    accent:    '#10b981',
    accent2:   '#3b82f6',
    accent3:   '#f59e0b',
    red:       '#ef4444',
    purple:    '#8b5cf6',
    text:      '#0f172a',
    text2:     '#475569',
    text3:     '#94a3b8',
    border:    '#e2e8f0',
    borderLite:'#cbd5e1',
    accentTxt: '#ffffff',
    shadow:    '0 1px 3px rgba(15,23,42,.06)',
    shadowLg:  '0 12px 40px rgba(16, 185, 129, .12)',
  },
};

export const MONO_FONT = '"SF Mono", Consolas, monospace';

// Shared style primitives derived from the active palette.
export const makeStyles = (C) => ({
  card:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:20, boxShadow:C.shadow },
  input:   { background:C.bg3, border:`1px solid ${C.borderLite}`, borderRadius:8, padding:'9px 12px', fontSize:13, color:C.text, width:'100%', fontFamily:'inherit', outline:'none', boxSizing:'border-box', transition:'border-color .15s, box-shadow .15s' },
  label:   { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase' },
  btnPri:  { background:C.accent, color:C.accentTxt, border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'opacity .15s, transform .15s' },
  btnGhost:{ background:'transparent', color:C.text2, border:`1px solid ${C.borderLite}`, borderRadius:8, padding:'9px 16px', fontSize:13, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, transition:'all .15s' },
  btnIcon: { background:'transparent', color:C.text2, border:'none', cursor:'pointer', padding:7, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
  td:      { padding:'12px 14px', fontSize:13, borderBottom:`1px solid ${C.border}` },
});

export const makeFocusHandlers = (C) => ({
  onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
  onBlur:  e => { e.target.style.borderColor = C.borderLite; e.target.style.boxShadow = 'none'; },
});
