import { useTheme } from '../../hooks/useTheme';

/**
 * Table header cell. When `sortKey` is provided the column becomes
 * clickable and shows the direction arrow while active.
 */
export function Th({ children, sortKey, sortBy, sortDir, onSort }) {
  const { C } = useTheme();
  return (
    <th
      onClick={sortKey ? () => onSort(sortKey) : undefined}
      style={{
        fontSize:11, color:C.text2, fontWeight:600, textAlign:'left',
        padding:'12px 14px', borderBottom:`1px solid ${C.border}`,
        textTransform:'uppercase', letterSpacing:'.4px', whiteSpace:'nowrap',
        cursor: sortKey ? 'pointer' : 'default', userSelect:'none',
      }}>
      <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
        {children}
        {sortKey && sortKey === sortBy && <span style={{color:C.accent, fontSize:10}}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  );
}
