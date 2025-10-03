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
  start_date?: string | null; 
  due_date?: string | null;   
  created_at: string;          
  updated_at: string;          
  feedback?: Feedback;     
  CheckLists: CheckList[];
}

export interface Feedback {
  id: number;
  card: number; // ID do Card
  text?: string | null;
}

export interface CheckList {
  id: number; 
  title: string;
  is_check: boolean;
  created_at: string;          
  updated_at: string;   
}

export interface File {
  id: number;
  card: number;           // id do Card relacionado
  is_approved: boolean;
  file: string;           // URL do arquivo
  created_at: string;     
  updated_at: string;
}
