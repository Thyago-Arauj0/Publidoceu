export async function compressFile(file: File, quality = 0.7, maxWidth = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject("Falha ao ler arquivo");
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Falha ao criar contexto do canvas");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Falha ao gerar blob");
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type,
        quality
      );
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
