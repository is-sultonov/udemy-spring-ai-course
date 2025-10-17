import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    { name: t('navigation.transcribe'), href: '/transcribe', current: location.pathname === '/transcribe' },
    { name: t('navigation.history'), href: '/history', current: location.pathname === '/history' },
    { name: t('navigation.settings'), href: '/settings', current: location.pathname === '/settings' },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <span className={styles.logoIcon} aria-hidden="true">🎤</span>
              <span className={styles.logoText}>{t('app.title')}</span>
            </Link>
          </div>
          <nav className={styles.navigation} role="navigation" aria-label={t('navigation.main')}>
            <ul className={styles.navList}>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clsx(styles.navLink, {
                      [styles.navLinkActive]: item.current,
                    })}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className={styles.main} role="main">
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            {t('app.footer', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}