import { useCallback, useState } from 'react';

/**
 * Generic state for the add/edit modals: which modal is open, the entity
 * being edited (null = creating) and the controlled form values.
 */
export function useModalForm() {
  const [modal, setModal]           = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState({});

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd  = (type) => { setModal(type); setEditTarget(null); setForm({}); };
  const openEdit = (type, item) => { setModal(type); setEditTarget(item); setForm({ ...item }); };
  const closeModal = useCallback(() => { setModal(null); setEditTarget(null); setForm({}); }, []);

  return { modal, editTarget, form, fv, openAdd, openEdit, closeModal };
}
