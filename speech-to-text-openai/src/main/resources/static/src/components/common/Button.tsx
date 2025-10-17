import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import type { ComponentProps } from '../../types/ui';

import styles from './Button.module.css';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ComponentProps>, ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    fullWidth = false,
    disabled,
    children,
    className,
    testId = 'button',
    ...props
  }, ref) => {
    const buttonClasses = clsx(
      styles.button,
      styles[variant],
      styles[size],
      {
        [styles.loading]: isLoading,
        [styles.fullWidth]: fullWidth,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        data-testid={testId}
        {...props}
      >
        {isLoading && <span className={styles.loadingSpinner} aria-hidden="true" />}
        <span className={isLoading ? styles.loadingText : undefined}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';