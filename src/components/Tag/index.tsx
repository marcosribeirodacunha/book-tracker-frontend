import clsx from 'clsx';
import { ReactText } from 'react';
import { Book } from 'shared/types/Book';

import styles from './styles.module.scss';

interface ITagProps {
  color: 'yellow' | 'blue' | 'green';
  children: ReactText | ReactText[];
}

export function Tag({ color, children }: ITagProps) {
  const colorClass = styles[color];

  return (
    <span className={clsx(styles.container, colorClass)}>
      {children}
    </span>
  );
}
