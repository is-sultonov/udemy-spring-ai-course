import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import type { ComponentProps } from '@types/ui';

import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, ComponentProps {
  options: readonly Option[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    options,
    placeholder,
    error,
    disabled,
    className,
    testId = 'select',
    ...props
  }, ref) => {
    const selectClasses = clsx(
      styles.select,
      {
        [styles.error]: error,
        [styles.disabled]: disabled,
      },
      className
    );

    return (
      <div className={styles.container}>
        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          data-testid={testId}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.icon} aria-hidden="true">
          ▼
        </div>
        {error && (
          <p className={styles.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';