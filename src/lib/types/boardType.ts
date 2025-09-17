export interface Board {
  id: number
  customer: string
  author: string
  user: { id: number; name: string; email: string }
  created_at: string
  updated_at: string
}