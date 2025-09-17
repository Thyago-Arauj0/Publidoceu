"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { getNotifications } from "@/lib/Notification";
import type { Notification as AppNotification } from "@/lib/types/notificationType"

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  const toggleDropdown = () => setOpen(!open);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <Bell size={24} />
        {notifications.some(n => !n.is_read) && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Sem notificações</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                <strong className="block">{notif.title}</strong>
                <p className="text-gray-600 text-sm">{notif.description}</p>
                <small className="text-gray-400 text-xs">
                  {new Date(notif.timestamp).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
