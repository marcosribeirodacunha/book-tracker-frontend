import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}

const RATE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const RateRadioComponent: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  ({ label: groupLabel, name, ...rest }, forwardedRef) => {
    return (
      <div className={styles.container}>
        {groupLabel && <p>{groupLabel}</p>}

        <div className={styles.radiosContainer}>
          {RATE_VALUES.map((rate) => (
            <label
              key={rate}
              htmlFor={rate.toString()}
            >
              <input
                ref={forwardedRef}
                type="radio"
                name={name}
                id={rate.toString()}
                value={rate}
                {...rest}
              />

              <span>{rate}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }
)

export const RateRadio = forwardRef(RateRadioComponent)