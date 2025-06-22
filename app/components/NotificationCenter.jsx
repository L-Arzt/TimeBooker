'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { NotificationType } from '@/app/libs/notificationService';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Функция для получения иконки в зависимости от типа уведомления
  const getNotificationIcon = (type) => {
    switch (type) {
      case NotificationType.BOOKING_CREATED:
      case NotificationType.SPECIALIST_NEW_BOOKING:
      case NotificationType.MANAGER_NEW_BOOKING:
        return '📅';
      case NotificationType.BOOKING_CANCELLED:
      case NotificationType.SPECIALIST_BOOKING_CANCELLED:
      case NotificationType.MANAGER_BOOKING_CANCELLED:
        return '❌';
      case NotificationType.BOOKING_UPDATED:
      case NotificationType.SPECIALIST_BOOKING_UPDATED:
      case NotificationType.MANAGER_BOOKING_UPDATED:
        return '🔄';
      case NotificationType.BOOKING_REMINDER_DAY:
      case NotificationType.BOOKING_REMINDER_HOUR:
        return '⏰';
      case NotificationType.BOOKING_COMPLETED:
        return '✅';
      case NotificationType.SPECIALIST_SCHEDULE_UPDATED:
      case NotificationType.MANAGER_SCHEDULE_UPDATED:
        return '📊';
      case NotificationType.SPECIALIST_SERVICES_UPDATED:
      case NotificationType.MANAGER_SERVICES_UPDATED:
        return '🛠️';
      case NotificationType.MANAGER_LOW_LOAD:
        return '⚠️';
      default:
        return '📢';
    }
  };

  // Функция для получения цвета в зависимости от типа уведомления
  const getNotificationColor = (type) => {
    if (type.includes('CANCELLED')) return 'text-red-500';
    if (type.includes('REMINDER')) return 'text-yellow-500';
    if (type.includes('COMPLETED')) return 'text-green-500';
    if (type.includes('LOW_LOAD')) return 'text-orange-500';
    return 'text-blue-500';
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Обновляем каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Уведомления</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Нет новых уведомлений
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1">
                        <h4 className={`font-medium ${getNotificationColor(notification.type)}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 