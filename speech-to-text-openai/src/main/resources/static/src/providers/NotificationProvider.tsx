import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import type { NotificationOptions } from '@types/ui';

import styles from './NotificationProvider.module.css';

interface Notification extends NotificationOptions {
  id: string;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (options: NotificationOptions) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((options: NotificationOptions) => {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      ...options,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove if not persistent
    if (!options.persistent) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, options.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className={styles.container} aria-live="polite" aria-label="Notifications">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`${styles.notification} ${styles[notification.type]}`}
            role="alert"
          >
            <div className={styles.content}>
              <h4 className={styles.title}>{notification.title}</h4>
              <p className={styles.message}>{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={styles.closeButton}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}