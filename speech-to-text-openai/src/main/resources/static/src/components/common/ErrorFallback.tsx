import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import type { ComponentProps } from '@types/ui';

import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps extends ComponentProps {
  error?: Error;
  resetError?: () => void;
}

export function ErrorFallback({ error, resetError, testId = 'error-fallback' }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container} data-testid={testId} role="alert">
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          ⚠️
        </div>
        <h2 className={styles.title}>{t('error.title')}</h2>
        <p className={styles.message}>
          {error?.message || t('error.generic')}
        </p>
        {resetError && (
          <Button onClick={resetError} variant="primary" testId="error-retry-button">
            {t('error.retry')}
          </Button>
        )}
      </div>
    </div>
  );
}