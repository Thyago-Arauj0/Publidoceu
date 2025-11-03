'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Plus, Upload, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { createFile } from "@/lib/services/File"
import { uploadToCloudinary } from "@/lib/services/Cloudinary"
import { compressFile } from "@/lib/helpers/compressFile"

export default function AddFileModal({ 
  boardId,
  cardId, 
  onCreated 
}: { 
  boardId: string
  cardId: string 
  onCreated: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setSelectedFiles(prev => [...prev, ...newFiles])
    e.target.value = "" // permite reescolher os mesmos arquivos
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return

    setLoading(true)
    setError(null)

    try {
      // 🔹 1️⃣ Faz upload direto ao Cloudinary e salva a URL no backend
      for (const file of selectedFiles) {
        const imageTypes = ["image/jpeg", "image/png", "image/webp"];
        let compressedFile = file;
        // Só comprimir se for imagem
        if (imageTypes.includes(file.type)) {
          compressedFile = await compressFile(file, 0.7);// sua função de compressão
        }
        
        const cloudinaryUrl = await uploadToCloudinary(compressedFile)// retorna secure_url
        await createFile(boardId, cardId, { file: cloudinaryUrl } as any)// salva a URL no backend
      }

      // 🔹 2️⃣ Limpa e atualiza a lista
      setSelectedFiles([])
      setIsOpen(false)
      onCreated()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Erro ao adicionar arquivos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-[#d35429] hover:bg-[#833a21]"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Arquivo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Arquivos</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="files">Selecionar Arquivos</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="files"
                  type="file" 
                  multiple 
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => document.getElementById("files")?.click()}
                  className="cursor-pointer w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Arquivos
                </Button>
              </div>
            </div>

            {/* Lista de arquivos selecionados */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos selecionados ({selectedFiles.length})</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                          <span className="text-sm truncate block min-w-0 flex-1 max-w-[10vh]">{file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={selectedFiles.length === 0 || loading}
                className="cursor-pointer bg-green-600 hover:bg-green-700"
              >
                {loading ? "Enviando..." : "Adicionar Arquivos"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
