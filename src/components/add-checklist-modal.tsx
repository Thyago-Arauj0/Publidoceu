"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createCheckList } from "@/lib/CheckList";

export default function AddChecklistModal({ cardId, onCreated }: { cardId: string; onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title) {
      setError("O título é obrigatório.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("is_check", "false");

    setIsLoading(true);
    try {
      await createCheckList(cardId, formData);
      setTitle("");
      setIsOpen(false);
      onCreated(); // atualiza a lista de checklists no CardDetails
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar checklist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">Adicionar Checklist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Criar Checklist</DialogTitle>
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
            <Button onClick={handleCreate} disabled={isLoading}>{isLoading ? "Criando..." : "Criar"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
