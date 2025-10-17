import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { NotificationProvider } from './providers/NotificationProvider';

// Lazy load pages for code splitting
const TranscriptionPage = lazy(() => import('./pages/TranscriptionPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <NotificationProvider>
      <Layout>
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="large" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/transcribe" replace />} />
            <Route path="/transcribe" element={<TranscriptionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </NotificationProvider>
  );
}

export default App;