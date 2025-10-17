import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { fileValidation } from '@services/api';
import { FILE_UPLOAD_CONFIG } from '@constants/index';
import type { FileValidationResult, ComponentProps } from '@types/ui';

import styles from './FileUpload.module.css';

interface FileUploadProps extends ComponentProps {
  onFileSelect: (file: File) => void;
  onValidationError: (errors: string[]) => void;
  disabled?: boolean;
  value?: File;
}

export function FileUpload({
  onFileSelect,
  onValidationError,
  disabled = false,
  value,
  className,
  testId = 'file-upload',
  ...accessibilityProps
}: FileUploadProps) {
  const { t } = useTranslation();
  const [dragState, setDragState] = useState({
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
  });

  const validateAndSelectFile = useCallback((file: File) => {
    const validation = fileValidation.validateFile(file);
    
    if (!validation.isValid) {
      onValidationError(validation.errors);
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, onValidationError]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragState(prev => ({ ...prev, isDragActive: false }));

    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ errors }) => 
        errors.map(({ message }: { message: string }) => message).join(', ')
      ).flat();
      onValidationError(errors);
      return;
    }

    if (acceptedFiles.length > 0) {
      validateAndSelectFile(acceptedFiles[0]);
    }
  }, [validateAndSelectFile, onValidationError]);

  const onDragEnter = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragActive: true }));
  }, []);

  const onDragLeave = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragActive: false }));
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: FILE_UPLOAD_CONFIG.ACCEPTED_TYPES,
    maxSize: FILE_UPLOAD_CONFIG.MAX_SIZE,
    multiple: false,
    disabled,
    noClick: disabled,
    noKeyboard: disabled,
  });

  // Update local state when dropzone state changes
  useState(() => {
    setDragState({
      isDragActive,
      isDragAccept,
      isDragReject,
    });
  });

  const dropzoneClasses = clsx(
    styles.dropzone,
    {
      [styles.active]: isDragActive,
      [styles.accept]: isDragAccept,
      [styles.reject]: isDragReject,
      [styles.disabled]: disabled,
      [styles.hasFile]: value,
    },
    className
  );

  const formatFileSize = (size: number) => fileValidation.formatFileSize(size);
  const maxSizeFormatted = formatFileSize(FILE_UPLOAD_CONFIG.MAX_SIZE);

  return (
    <div className={styles.container}>
      <div
        {...getRootProps()}
        className={dropzoneClasses}
        data-testid={testId}
        {...accessibilityProps}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={t('fileUpload.dropzoneLabel')}
        aria-describedby="file-upload-description"
      >
        <input
          {...getInputProps()}
          aria-describedby="file-upload-description"
          data-testid={`${testId}-input`}
        />
        
        <div className={styles.content}>
          {value ? (
            <div className={styles.selectedFile} data-testid="selected-file">
              <div className={styles.fileIcon} aria-hidden="true">
                🎵
              </div>
              <div className={styles.fileInfo}>
                <div className={styles.fileName} title={value.name}>
                  {value.name}
                </div>
                <div className={styles.fileSize}>
                  {formatFileSize(value.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null as any); // Clear file
                }}
                className={styles.removeButton}
                aria-label={t('fileUpload.removeFile')}
                data-testid="remove-file-button"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon} aria-hidden="true">
                {isDragActive ? '📁' : '⬆️'}
              </div>
              <div className={styles.text}>
                <p className={styles.primaryText}>
                  {isDragActive
                    ? t('fileUpload.dropHere')
                    : t('fileUpload.dragOrClick')
                  }
                </p>
                <p className={styles.secondaryText} id="file-upload-description">
                  {t('fileUpload.supportedFormats', { 
                    formats: FILE_UPLOAD_CONFIG.ACCEPTED_EXTENSIONS.join(', '),
                    maxSize: maxSizeFormatted 
                  })}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isDragActive && t('fileUpload.dragActiveAnnouncement')}
        {value && t('fileUpload.fileSelectedAnnouncement', { fileName: value.name })}
      </div>
    </div>
  );
}