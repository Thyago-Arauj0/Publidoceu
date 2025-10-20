import { authFetch } from "./Auth";
import { Notification } from "../types/notificationType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const getNotifications = async (): Promise<Notification[]> => {
  return authFetch<Notification[]>(`${API_BASE_URL}/api/v1/notification/`, {
    method: "GET",
  });
};
