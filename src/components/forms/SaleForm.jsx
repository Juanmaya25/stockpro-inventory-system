import { useTheme } from '../../hooks/useTheme';
import { MONO_FONT } from '../../styles/theme';

/** Body of the register-sale modal. Computes the live total from the picked product. */
export function SaleForm({ form, fv, products, clients }) {
  const { C, S, focusH } = useTheme();
  const saleProd  = products.find(p => p.sku === form.sku);
  const saleQty   = +form.qty || 1;
  const saleTotal = saleProd ? saleProd.price * saleQty : 0;

  return (
    <>
      <div style={{marginBottom:14}}>
        <label style={S.label}>Producto *</label>
        <select style={S.input} value={form.sku||''} onChange={fv('sku')} {...focusH}>
          <option value="">Seleccionar producto...</option>
          {products.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.sku}>{p.name} — Stock: {p.stock} — ${p.price}</option>)}
        </select>
      </div>
      {saleProd && (
        <div style={{background:C.bg3, borderRadius:8, padding:12, marginBottom:14, fontSize:13, display:'flex', gap:20, flexWrap:'wrap', border:`1px solid ${C.border}`}}>
          <span><span style={{color:C.text2}}>Precio: </span><span style={{color:C.accent, fontWeight:700, fontFamily:MONO_FONT}}>${saleProd.price}</span></span>
          <span><span style={{color:C.text2}}>Disponible: </span><span style={{fontWeight:700, fontFamily:MONO_FONT}}>{saleProd.stock} und.</span></span>
        </div>
      )}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
        <div><label style={S.label}>Cantidad *</label><input style={S.input} type="number" min="1" max={saleProd?.stock} value={form.qty||''} onChange={fv('qty')} placeholder="1" {...focusH} /></div>
        <div><label style={S.label}>Método de pago</label>
          <select style={S.input} value={form.method||'Efectivo'} onChange={fv('method')} {...focusH}>
            <option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option><option>PSE</option>
          </select>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label style={S.label}>Cliente</label>
        <select style={S.input} value={form.client||''} onChange={fv('client')} {...focusH}>
          <option value="">Cliente general</option>
          {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      {saleTotal > 0 && (
        <div style={{background:`${C.accent}15`, border:`1px solid ${C.accent}40`, borderRadius:10, padding:18, textAlign:'center'}}>
          <div style={{fontSize:11, color:C.text2, marginBottom:4, letterSpacing:'.4px', textTransform:'uppercase', fontWeight:600}}>Total a cobrar</div>
          <div style={{fontSize:32, fontWeight:800, fontFamily:MONO_FONT, color:C.accent, letterSpacing:'-1px'}}>${saleTotal.toLocaleString()}</div>
        </div>
      )}
    </>
  );
}
