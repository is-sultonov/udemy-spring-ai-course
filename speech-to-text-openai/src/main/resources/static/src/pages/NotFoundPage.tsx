import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/common/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', margin: '0 0 2rem 0' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
}