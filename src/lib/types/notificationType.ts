
export interface Notification {
  id: number;
  user?: number;          // ou string se usar UUID
  author?: number;
  title: string;
  description: string;
  is_read: boolean;
  content_type: number;
  object_id: number;
  timestamp: string;      // Data em ISO string
  created_at: string;
  updated_at: string;
};
