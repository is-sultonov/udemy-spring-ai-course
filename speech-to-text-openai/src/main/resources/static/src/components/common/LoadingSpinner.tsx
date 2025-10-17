import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { ComponentProps } from '@types/ui';

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps extends ComponentProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export function LoadingSpinner({
  size = 'medium',
  variant = 'primary',
  text,
  className,
  testId = 'loading-spinner',
  ...accessibilityProps
}: LoadingSpinnerProps) {
  const { t } = useTranslation();

  const spinnerClasses = clsx(
    styles.spinner,
    styles[size],
    styles[variant],
    className
  );

  const defaultText = t('common.loading');
  const loadingText = text || defaultText;

  return (
    <div 
      className={styles.container}
      data-testid={testId}
      {...accessibilityProps}
    >
      <div
        className={spinnerClasses}
        role="status"
        aria-label={loadingText}
      >
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
      </div>
      {text && (
        <span className={styles.text} aria-hidden="true">
          {text}
        </span>
      )}
      <span className="sr-only">{loadingText}</span>
    </div>
  );
}