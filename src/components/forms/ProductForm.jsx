import { useTheme } from '../../hooks/useTheme';

const CATEGORIES = ['Electrónica', 'Hardware', 'Accesorios', 'Audio', 'Almacenamiento', 'Otro'];

/** Body of the add/edit product modal. */
export function ProductForm({ form, fv, suppliers }) {
  const { S, focusH } = useTheme();
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Ej: Laptop Dell XPS 13" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>SKU *</label><input style={S.input} value={form.sku||''} onChange={fv('sku')} placeholder="EL-0041" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Código de barras</label><input style={S.input} value={form.barcode||''} onChange={fv('barcode')} placeholder="7701234567000" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Categoría</label>
        <select style={S.input} value={form.category||''} onChange={fv('category')} {...focusH}>
          <option value="">Seleccionar...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div><label style={S.label}>Proveedor</label>
        <select style={S.input} value={form.supplier||''} onChange={fv('supplier')} {...focusH}>
          <option value="">Seleccionar...</option>
          {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      <div><label style={S.label}>Precio venta * ($)</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="0" {...focusH} /></div>
      <div><label style={S.label}>Costo ($)</label><input style={S.input} type="number" min="0" value={form.cost||''} onChange={fv('cost')} placeholder="0" {...focusH} /></div>
      <div><label style={S.label}>Stock actual</label><input style={S.input} type="number" min="0" value={form.stock||''} onChange={fv('stock')} placeholder="0" {...focusH} /></div>
      <div><label style={S.label}>Stock mínimo</label><input style={S.input} type="number" min="0" value={form.minStock||''} onChange={fv('minStock')} placeholder="5" {...focusH} /></div>
    </div>
  );
}
