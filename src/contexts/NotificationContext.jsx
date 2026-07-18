import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import notificationService from "../services/notificationService";

const NotificationContext = createContext(null);

export function NotificationProvider({
  children,
}) {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /* ======================================
     Load Notification
  ====================================== */

  const loadNotifications =
    async () => {
      try {
        setLoading(true);

        const data =
          await notificationService.getNotifications();

        setNotifications(data);

        setError(null);
      } catch (err) {
        console.error(err);

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  /* ======================================
     Initial Load + Realtime
  ====================================== */

  useEffect(() => {
    loadNotifications();

    const unsubscribe =
      notificationService.subscribe(
        (data) => {
          setNotifications(data);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  /* ======================================
     Total Unread
  ====================================== */

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (item) => item.unread
    ).length;
  }, [notifications]);

  /* ======================================
     Unread List
  ====================================== */

  const unreadNotifications =
    useMemo(() => {
      return notifications.filter(
        (item) => item.unread
      );
    }, [notifications]);

  /* ======================================
     Read List
  ====================================== */

  const readNotifications =
    useMemo(() => {
      return notifications.filter(
        (item) => !item.unread
      );
    }, [notifications]);

  /* ======================================
     Mark One
  ====================================== */

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(
        id
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================================
     Mark All
  ====================================== */

  const markAllAsRead =
    async () => {
      try {
        await notificationService.markAllAsRead();
      } catch (err) {
        console.error(err);
      }
    };

  /* ======================================
     Delete
  ====================================== */

  const removeNotification =
    async (id) => {
      try {
        await notificationService.deleteNotification(
          id
        );
      } catch (err) {
        console.error(err);
      }
    };

  /* ======================================
     Clear
  ====================================== */

  const clearNotifications =
    async () => {
      try {
        await notificationService.clearNotifications();
      } catch (err) {
        console.error(err);
      }
    };

  /* ======================================
     Add (Opsional)
  ====================================== */

  const addNotification = () => {
    console.warn(
      "Gunakan insert langsung ke tabel notifications di Supabase."
    );
  };

  const value = {
    notifications,

    unreadNotifications,

    readNotifications,

    unreadCount,

    loading,

    error,

    reload: loadNotifications,

    markAsRead,

    markAllAsRead,

    addNotification,

    removeNotification,

    clearNotifications,
  };

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotification harus digunakan di dalam NotificationProvider."
    );
  }

  return context;
}