import { useCallback, useState } from 'react';

export function useToggle(initialValue = false): [boolean, () => void] {
  const [isOpen, setIsOpen] = useState(initialValue);

  const onToggle = useCallback(() => setIsOpen(state => !state), []);

  return [isOpen, onToggle];
}
