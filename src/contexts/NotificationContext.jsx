
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  notifications as notificationData,
} from "../data/notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({
  children,
}) {
  const [notifications, setNotifications] = useState(
    [...notificationData].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
  );

  // ======================================
  // Total Unread
  // ======================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (item) => item.unread
    ).length;
  }, [notifications]);

  // ======================================
  // Unread List
  // ======================================

  const unreadNotifications = useMemo(() => {
    return notifications.filter(
      (item) => item.unread
    );
  }, [notifications]);

  // ======================================
  // Read List
  // ======================================

  const readNotifications = useMemo(() => {
    return notifications.filter(
      (item) => !item.unread
    );
  }, [notifications]);

  // ======================================
  // Mark One
  // ======================================

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              unread: false,
              status: "Sudah Dibaca",
            }
          : item
      )
    );
  };

  // ======================================
  // Mark All
  // ======================================

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
        status: "Sudah Dibaca",
      }))
    );
  };

  // ======================================
  // Add
  // ======================================

  const addNotification = (
    notification
  ) => {
    const newNotification = {
      id: Date.now(),

      unread: true,

      status: "Belum Dibaca",

      createdAt: new Date().toISOString(),

      time: "Baru saja",

      ...notification,
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  // ======================================
  // Remove
  // ======================================

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  // ======================================
  // Clear
  // ======================================

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,

    unreadNotifications,

    readNotifications,

    unreadCount,

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