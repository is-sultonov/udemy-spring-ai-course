import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { FileUpload } from './FileUpload';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SUPPORTED_LANGUAGES, RESPONSE_FORMATS } from '@constants/index';
import type { TranscriptionRequest, ResponseFormat, SupportedLanguage } from '@types/api';
import type { ComponentProps } from '@types/ui';

import styles from './TranscriptionForm.module.css';

// Form validation schema
const transcriptionSchema = z.object({
  file: z.instanceof(File, { message: 'Please select an audio file' }),
  language: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'vtt', 'verbose_json']).default('json'),
});

type FormData = z.infer<typeof transcriptionSchema>;

interface TranscriptionFormProps extends ComponentProps {
  onSubmit: (data: TranscriptionRequest) => void;
  onAsyncSubmit: (data: TranscriptionRequest) => void;
  isLoading?: boolean;
  progress?: number;
}

export function TranscriptionForm({
  onSubmit,
  onAsyncSubmit,
  isLoading = false,
  progress = 0,
  className,
  testId = 'transcription-form',
  ...accessibilityProps
}: TranscriptionFormProps) {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(transcriptionSchema),
    defaultValues: {
      responseFormat: 'json',
    },
    mode: 'onChange',
  });

  const watchedFile = watch('file');

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setValue('file', file, { shouldValidate: true });
      setValidationErrors([]);
    } else {
      setValue('file', undefined as any);
    }
  };

  const handleValidationError = (errors: string[]) => {
    setValidationErrors(errors);
  };

  const handleFormSubmit = (data: FormData, isAsync: boolean = false) => {
    const request: TranscriptionRequest = {
      file: data.file,
      language: data.language,
      responseFormat: data.responseFormat,
    };

    if (isAsync) {
      onAsyncSubmit(request);
    } else {
      onSubmit(request);
    }
  };

  const isFormDisabled = isLoading;
  const hasErrors = Object.keys(errors).length > 0 || validationErrors.length > 0;

  return (
    <form
      onSubmit={handleSubmit((data) => handleFormSubmit(data, false))}
      className={clsx(styles.form, className)}
      data-testid={testId}
      {...accessibilityProps}
    >
      {/* File Upload Section */}
      <div className={styles.section}>
        <label className={styles.sectionLabel} htmlFor="file-upload">
          {t('transcriptionForm.audioFile')} *
        </label>
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <FileUpload
              onFileSelect={handleFileSelect}
              onValidationError={handleValidationError}
              value={field.value}
              disabled={isFormDisabled}
              id="file-upload"
              aria-describedby={errors.file ? 'file-error' : undefined}
              testId="form-file-upload"
            />
          )}
        />
        
        {/* File validation errors */}
        {(errors.file || validationErrors.length > 0) && (
          <div className={styles.errorContainer} role="alert">
            {errors.file && (
              <p className={styles.error} id="file-error">
                {errors.file.message}
              </p>
            )}
            {validationErrors.map((error, index) => (
              <p key={index} className={styles.error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Options Section */}
      <div className={styles.optionsGrid}>
        {/* Language Selection */}
        <div className={styles.option}>
          <label className={styles.optionLabel} htmlFor="language-select">
            {t('transcriptionForm.language')}
          </label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                id="language-select"
                options={SUPPORTED_LANGUAGES}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('transcriptionForm.selectLanguage')}
                disabled={isFormDisabled}
                aria-describedby="language-help"
                testId="language-select"
              />
            )}
          />
          <p className={styles.helpText} id="language-help">
            {t('transcriptionForm.languageHelp')}
          </p>
        </div>

        {/* Response Format Selection */}
        <div className={styles.option}>
          <label className={styles.optionLabel} htmlFor="format-select">
            {t('transcriptionForm.responseFormat')}
          </label>
          <Controller
            name="responseFormat"
            control={control}
            render={({ field }) => (
              <Select
                id="format-select"
                options={RESPONSE_FORMATS}
                value={field.value}
                onChange={field.onChange}
                disabled={isFormDisabled}
                aria-describedby="format-help"
                testId="format-select"
              />
            )}
          />
          <p className={styles.helpText} id="format-help">
            {t('transcriptionForm.formatHelp')}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className={styles.progressSection} role="status" aria-live="polite">
          <div className={styles.progressHeader}>
            <LoadingSpinner size="small" />
            <span className={styles.progressText}>
              {t('transcriptionForm.processing')}
            </span>
          </div>
          {progress > 0 && (
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('transcriptionForm.progressLabel', { progress })}
              />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={!isValid || hasErrors || isFormDisabled || !watchedFile}
          className={styles.primaryButton}
          testId="submit-sync-button"
        >
          {isLoading ? t('transcriptionForm.processing') : t('transcriptionForm.transcribe')}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="large"
          disabled={!isValid || hasErrors || isFormDisabled || !watchedFile}
          onClick={handleSubmit((data) => handleFormSubmit(data, true))}
          className={styles.secondaryButton}
          testId="submit-async-button"
        >
          {t('transcriptionForm.transcribeAsync')}
        </Button>
      </div>

      {/* Form Help Text */}
      <div className={styles.helpSection}>
        <p className={styles.helpText}>
          {t('transcriptionForm.formHelp')}
        </p>
      </div>
    </form>
  );
}