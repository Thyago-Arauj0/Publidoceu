
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface PropsError {
  open: boolean;
  setIsErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
}

export default function ModalError({ open, setIsErrorModalOpen, error }: PropsError) {
  return (
    <Dialog open={open} onOpenChange={setIsErrorModalOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Erro</DialogTitle>
        </DialogHeader>
        <p className="text-red-600 mt-2">{error}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsErrorModalOpen(false)} className="cursor-pointer">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
