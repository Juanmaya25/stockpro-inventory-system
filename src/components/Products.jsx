import { useTheme } from '../hooks/useTheme';
import { Icon } from '../icons';
import { Th } from './common/Th';
import { StockBadge } from './common/StockBadge';
import { getMargin, getStockPercent, getStockStatus } from '../utils/inventory';
import { MONO_FONT } from '../styles/theme';

export function Products({
  products, filteredProducts, categories, lowCount, outCount,
  search, onSearchChange, catFilter, onCatFilterChange,
  sortBy, sortDir, onSort, onResetFilters,
  onExport, onAdd, onEdit, onDelete,
}) {
  const { C, S, focusH } = useTheme();

  const kpis = [
    { l:'Total',      v:products.length,                                   sub:'productos',          c:C.accent  },
    { l:'En stock',   v:products.filter(p => p.stock > p.minStock).length, sub:'productos',          c:'#22c55e' },
    { l:'Stock bajo', v:lowCount,                                          sub:'requieren atención', c:C.accent3 },
    { l:'Agotados',   v:outCount,                                          sub:'productos',          c:C.red     },
  ];

  const barColor = (p) =>
    ({ out:C.red, low:C.accent3, ok:C.accent })[getStockStatus(p.stock, p.minStock)];

  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Inventario</h1>
          <div style={{fontSize:13, color:C.text2, marginTop:4}}>{filteredProducts.length} de {products.length} productos</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => onExport(filteredProducts, 'inventario')}><Icon.download /> Exportar CSV</button>
          <button style={S.btnPri} onClick={onAdd}><Icon.plus /> Agregar producto</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:18}}>
        {kpis.map(k => (
          <div key={k.l} style={{...S.card, padding:'16px 18px'}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:800, color:k.c, fontFamily:MONO_FONT, letterSpacing:'-.5px', lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:11, color:C.text3, marginTop:6}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:320}}>
          <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:36}} placeholder="Buscar nombre o SKU..." value={search} onChange={e => onSearchChange(e.target.value)} {...focusH} />
        </div>
        <select style={{...S.input, width:'auto'}} value={catFilter} onChange={e => onCatFilterChange(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || catFilter !== 'all') && <button style={S.btnGhost} onClick={onResetFilters}>Limpiar filtros</button>}
      </div>

      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:960}}>
            <thead style={{background:C.bg3}}>
              <tr>
                <Th sortKey="name"  sortBy={sortBy} sortDir={sortDir} onSort={onSort}>Producto</Th>
                <Th sortKey="sku"   sortBy={sortBy} sortDir={sortDir} onSort={onSort}>SKU</Th>
                <Th>Categoría</Th>
                <Th sortKey="stock" sortBy={sortBy} sortDir={sortDir} onSort={onSort}>Stock</Th>
                <Th>Mín</Th>
                <Th sortKey="price" sortBy={sortBy} sortDir={sortDir} onSort={onSort}>Precio</Th>
                <Th>Costo</Th>
                <Th>Margen</Th>
                <Th>Estado</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const margin = getMargin(p);
                const pct    = getStockPercent(p);
                return (
                  <tr key={p.id}
                    style={{transition:'background .12s'}}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{...S.td, fontWeight:600, color:C.text}}>{p.name}</td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontSize:11, color:C.text2}}>{p.sku}</td>
                    <td style={{...S.td, fontSize:12, color:C.text2}}>{p.category}</td>
                    <td style={S.td}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{width:48, height:5, borderRadius:3, background:C.bg3}}>
                          <div style={{width:`${pct}%`, height:'100%', borderRadius:3, background:barColor(p), transition:'width .3s'}} />
                        </div>
                        <span style={{fontFamily:MONO_FONT, fontWeight:700, fontSize:12, color:C.text}}>{p.stock}</span>
                      </div>
                    </td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontSize:12, color:C.text2}}>{p.minStock}</td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontWeight:700, color:C.accent}}>${p.price}</td>
                    <td style={{...S.td, fontFamily:MONO_FONT, fontSize:12, color:C.text2}}>${p.cost}</td>
                    <td style={{...S.td, fontWeight:700, color: margin > 30 ? C.accent : margin > 15 ? C.accent3 : C.red}}>{margin}%</td>
                    <td style={S.td}><StockBadge stock={p.stock} minStock={p.minStock} /></td>
                    <td style={S.td}>
                      <div style={{display:'flex', gap:4, justifyContent:'flex-end'}}>
                        <button style={S.btnIcon} onClick={() => onEdit(p)} aria-label="Editar"
                          onMouseEnter={e => { e.currentTarget.style.background = `${C.accent}20`; e.currentTarget.style.color = C.accent; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                          <Icon.pencil />
                        </button>
                        <button style={S.btnIcon} onClick={() => onDelete(p.id)} aria-label="Eliminar"
                          onMouseEnter={e => { e.currentTarget.style.background = `${C.red}20`; e.currentTarget.style.color = C.red; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}>
                          <Icon.trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
