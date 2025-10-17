import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';

import { TranscriptionForm } from '../components/forms/TranscriptionForm';
import { TranscriptionResult } from '../components/transcription/TranscriptionResult';
import { apiService } from '../services/api';
import { useNotifications } from '../providers/NotificationProvider';
import type { TranscriptionRequest, TranscriptionResponse } from '@types/api';

import styles from './TranscriptionPage.module.css';

export default function TranscriptionPage() {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const [result, setResult] = useState<TranscriptionResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const transcribeMutation = useMutation({
    mutationFn: async (request: TranscriptionRequest) => {
      setUploadProgress(0);
      return apiService.transcribeAudio(request, {
        onUploadProgress: (progress) => {
          setUploadProgress(progress.percentage);
        },
      });
    },
    onSuccess: (data) => {
      setResult(data);
      setUploadProgress(0);
      addNotification({
        type: 'success',
        title: t('transcription.result'),
        message: 'Transcription completed successfully!',
      });
    },
    onError: (error) => {
      setUploadProgress(0);
      addNotification({
        type: 'error',
        title: 'Transcription Failed',
        message: error instanceof Error ? error.message : 'An error occurred during transcription',
      });
    },
  });

  const transcribeAsyncMutation = useMutation({
    mutationFn: async (request: TranscriptionRequest) => {
      return apiService.transcribeAudioAsync(request, {
        onUploadProgress: (progress) => {
          setUploadProgress(progress.percentage);
        },
      });
    },
    onSuccess: () => {
      setUploadProgress(0);
      addNotification({
        type: 'info',
        title: 'Processing Started',
        message: 'Your file is being processed in the background. You will be notified when it\'s ready.',
      });
    },
    onError: (error) => {
      setUploadProgress(0);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'An error occurred during upload',
      });
    },
  });

  const handleDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, filename);
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addNotification({
        type: 'success',
        title: t('transcription.copied'),
        message: 'Text copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not copy text to clipboard',
      });
    }
  };

  const isLoading = transcribeMutation.isPending || transcribeAsyncMutation.isPending;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('app.title')}</h1>
        <p className={styles.subtitle}>
          Upload your audio file and get an accurate transcription powered by OpenAI Whisper
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <TranscriptionForm
            onSubmit={transcribeMutation.mutate}
            onAsyncSubmit={transcribeAsyncMutation.mutate}
            isLoading={isLoading}
            progress={uploadProgress}
          />
        </div>

        {result && (
          <div className={styles.resultSection}>
            <TranscriptionResult
              result={result}
              onDownload={handleDownload}
              onCopyToClipboard={handleCopyToClipboard}
            />
          </div>
        )}
      </div>
    </div>
  );
}