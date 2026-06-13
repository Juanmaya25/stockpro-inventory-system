import { useTheme } from '../../hooks/useTheme';

const FIELDS = [
  ['name',  'Nombre completo *'],
  ['email', 'Correo electrónico'],
  ['phone', 'Teléfono'],
];

/** Body of the add/edit client modal. */
export function ClientForm({ form, fv }) {
  const { S, focusH } = useTheme();
  return (
    <>
      {FIELDS.map(([k, l]) => (
        <div key={k} style={{marginBottom:14}}>
          <label style={S.label}>{l}</label>
          <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} autoComplete="off" {...focusH} />
        </div>
      ))}
    </>
  );
}
