import { useTranslation } from 'react-i18next';

export default function HistoryPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('navigation.history')}</h1>
      <p>Transcription history will be displayed here in a future update.</p>
    </div>
  );
}