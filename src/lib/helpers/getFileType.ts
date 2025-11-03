  // Função para obter o tipo de arquivo baseado na URL
  export const getFileType = (fileUrl: string): string => {
    if (fileUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return 'video'
    if (fileUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) return 'image'
    return 'other'
  }
