import clsx from 'clsx';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { InputHTMLAttributes } from 'react';
import styles from './styles.module.scss';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  ({ label, error, type = 'text', name, ...rest }, forwardedRef) => {
    return (
      <div className={clsx(styles.inputContainer, error && styles.hasError)}>
        {label && <label htmlFor={name}>{label}</label>}

        <input
          ref={forwardedRef}
          type={type}
          name={name}
          id={name}
          {...rest}
        />

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    )
  }
)

export const Input = forwardRef(InputComponent)
