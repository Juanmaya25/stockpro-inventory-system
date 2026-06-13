import { useTheme } from '../../hooks/useTheme';
import { getStockStatus } from '../../utils/inventory';

const LABELS = { out:'Agotado', low:'Stock bajo', ok:'En stock' };

export function StockBadge({ stock, minStock }) {
  const { C } = useTheme();
  const status = getStockStatus(stock, minStock);
  const color  = { out:C.red, low:C.accent3, ok:C.accent }[status];
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:100, background:`${color}20`, color, whiteSpace:'nowrap'}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:color}} />
      {LABELS[status]}
    </span>
  );
}
