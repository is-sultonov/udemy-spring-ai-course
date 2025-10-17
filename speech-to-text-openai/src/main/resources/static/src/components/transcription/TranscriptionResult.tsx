import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';
import type { TranscriptionResponse } from '@types/api';
import type { ComponentProps } from '@types/ui';

import styles from './TranscriptionResult.module.css';

interface TranscriptionResultProps extends ComponentProps {
  result: TranscriptionResponse;
  onDownload: (content: string, filename: string, mimeType: string) => void;
  onCopyToClipboard: (text: string) => void;
}

export function TranscriptionResult({
  result,
  onDownload,
  onCopyToClipboard,
  className,
  testId = 'transcription-result',
}: TranscriptionResultProps) {
  const { t } = useTranslation();

  const handleDownloadText = () => {
    onDownload(result.transcription, 'transcription.txt', 'text/plain');
  };

  const handleCopy = () => {
    onCopyToClipboard(result.transcription);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.container} data-testid={testId}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('transcription.result')}</h2>
        <div className={styles.metadata}>
          {result.confidence && (
            <span className={styles.metadataItem}>
              {t('transcription.confidence', { confidence: Math.round(result.confidence * 100) })}
            </span>
          )}
          {result.duration && (
            <span className={styles.metadataItem}>
              {t('transcription.duration', { duration: result.duration })}
            </span>
          )}
          {result.language && (
            <span className={styles.metadataItem}>
              {t('transcription.language', { language: result.language })}
            </span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.transcriptionBox}>
          <p className={styles.transcriptionText}>{result.transcription}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleCopy}
          variant="secondary"
          testId="copy-button"
        >
          {t('transcription.copyToClipboard')}
        </Button>
        <Button
          onClick={handleDownloadText}
          variant="primary"
          testId="download-button"
        >
          {t('transcription.downloadText')}
        </Button>
      </div>

      {result.processedAt && (
        <div className={styles.footer}>
          <span className={styles.timestamp}>
            Processed: {formatDate(result.processedAt)}
          </span>
        </div>
      )}
    </div>
  );
}