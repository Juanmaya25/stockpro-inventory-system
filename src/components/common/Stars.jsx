import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../icons';

export function Stars({ n }) {
  const { C } = useTheme();
  return (
    <span style={{display:'inline-flex', gap:1}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{color: i <= n ? '#f5c842' : C.text3, display:'flex'}}>
          {Icon.star(i <= n)}
        </span>
      ))}
    </span>
  );
}
