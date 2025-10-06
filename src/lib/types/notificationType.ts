
export interface Notification {
  id: number;
  user?: number;   
  author?: number;
  title: string;
  description: string;
  is_read: boolean;
  content_type: number;
  object_id: number;
  timestamp: string;     
  created_at: string;
  updated_at: string;
};
