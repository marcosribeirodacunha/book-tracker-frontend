import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { ScaleLoader } from "react-spinners";

import styles from './styles.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, type = 'button', className, children, ...rest }: IButtonProps) {
  const variantClassName = styles[`btn${capitalize(variant)}`]

  return (
    <button
      type={type}
      className={clsx(styles.btn, variantClassName, isLoading && styles.loading, className)}
      {...rest}
    >
      {isLoading
        ? <ScaleLoader
          loading
          speedMultiplier={1.2}
          color="var(--gray-100)"
          height={16}
          radius={0}
          margin={2}
        />
        : children
      }
    </button>
  );
}

function capitalize(text: string) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}