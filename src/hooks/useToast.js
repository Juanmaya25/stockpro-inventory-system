import { useCallback, useState } from 'react';

const TOAST_MS = 3000;

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  return { toast, showToast };
}
