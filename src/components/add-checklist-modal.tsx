"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createCheckList, updateCheckList } from "@/lib/CheckList";
import { Edit } from "lucide-react";

interface Props {
  cardId: string;
  onCreated: () => void;
  checklistId?: string; // se existir, é edição
  initialTitle?: string;
}

export default function AddChecklistModal({ cardId, onCreated, checklistId, initialTitle = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle, isOpen]);

  const handleSubmit = async () => {
    if (!title) {
      setError("O título é obrigatório.");
      return;
    }

    setIsLoading(true);
    try {
      if (checklistId) {
        // passa status atual sem alteração, só envia o texto
        await updateCheckList(cardId, checklistId, false, title);
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("is_check", "false");
        await createCheckList(cardId, formData);
      }
      setTitle("");
      setIsOpen(false);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar checklist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {checklistId ? <Edit className="h-3 w-3"/> : "Adicionar Checklist"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{checklistId ? "Editar Checklist" : "Criar Checklist"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-2">
          <input
            type="text"
            placeholder="Título do checklist"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsOpen(false)} variant="ghost">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Salvando..." : checklistId ? "Salvar" : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
