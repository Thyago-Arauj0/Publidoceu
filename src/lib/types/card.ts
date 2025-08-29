export type CardStatus = "todo" | "in_progress" | "review" | "done" | "disapprove";

export const STATUS_LABELS_PT: Record<CardStatus, string> = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  review: "Em Revisão",
  done: "Concluído",
  disapprove: "Reprovado",
};


export interface Card {
  id: number;
  board: number; // apenas o ID do Board
  title: string;
  description?: string | null;
  image?: string | null;
  status: CardStatus;
  is_active: boolean;
  start_date?: string | null; // ISO string "YYYY-MM-DD"
  due_date?: string | null;   // ISO string "YYYY-MM-DD"
  created_at: string;          // ISO string
  updated_at: string;          // ISO string
  feedback?: Feedback;         // se incluir relação
}

export interface Feedback {
  id: number;
  card: number; // ID do Card
  text?: string | null;
}
