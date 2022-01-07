import { useCallback, useState } from 'react';

export function useArray<T>(initialValue: T[]) {
  const [array, setArray] = useState(initialValue);

  const replace = useCallback((value: T[]) => setArray(value), []);
  const prepend = useCallback((value: T) => setArray(old => [value, ...old]), []);

  const update = useCallback((index: number, updated: Partial<T>) => {
    setArray(old => {
      const copy = old.slice(0);
      const item = copy[index];
      copy[index] = { ...item, ...updated };
      return copy;
    })
  }, [])

  const remove = useCallback((index: number) => {
    setArray(old => [...old.slice(0, index), ...old.slice(index + 1)]);
  }, []);

  return { array, replace, prepend, update, remove, };
}
