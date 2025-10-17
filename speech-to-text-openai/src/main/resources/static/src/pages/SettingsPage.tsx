import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('navigation.settings')}</h1>
      <p>Application settings will be available here in a future update.</p>
    </div>
  );
}