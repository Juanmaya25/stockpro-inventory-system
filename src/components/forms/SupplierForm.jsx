import { useTheme } from '../../hooks/useTheme';

const FIELDS = [
  ['name',    'Nombre de la empresa *'],
  ['contact', 'Persona de contacto *'],
  ['email',   'Correo electrónico'],
  ['phone',   'Teléfono'],
];

/** Body of the add/edit supplier modal. Shows the status select only when editing. */
export function SupplierForm({ form, fv, editTarget }) {
  const { S, focusH } = useTheme();
  return (
    <>
      {FIELDS.map(([k, l]) => (
        <div key={k} style={{marginBottom:14}}>
          <label style={S.label}>{l}</label>
          <input style={S.input} value={form[k]||''} onChange={fv(k)} placeholder={l} autoComplete="off" {...focusH} />
        </div>
      ))}
      {editTarget && (
        <div>
          <label style={S.label}>Estado</label>
          <select style={S.input} value={form.status||'active'} onChange={fv('status')} {...focusH}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      )}
    </>
  );
}
