// src/lib/Cloudinary.ts
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
}

interface CloudinaryError {
  error: {
    message: string;
  };
}

export async function uploadToCloudinary(file: File): Promise<string> {
  console.log("🔍 Iniciando upload para Cloudinary...");
  console.log("📁 Arquivo:", file.name, "Tamanho:", formatFileSize(file.size), "Tipo:", file.type);
  console.log("☁️ Cloud Name:", CLOUDINARY_CLOUD_NAME);
  console.log("📝 Upload Preset:", CLOUDINARY_UPLOAD_PRESET);

  // Validação das variáveis de ambiente
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME não configurado");
  }
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("CLOUDINARY_UPLOAD_PRESET não configurado");
  }

  // Validação básica do arquivo
  if (!file || file.size === 0) {
    throw new Error("Arquivo inválido ou vazio");
  }

  // Limite de tamanho (opcional - 100MB)
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
  }

  try {
    // ✅ MÉTODO SIMPLES: Upload direto com Upload Preset (SEM assinatura)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    // Opcional: Adicionar folder
    formData.append("folder", "files_cards");

    console.log("📦 Enviando para Cloudinary...");
    console.log("📋 FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`   ${key}:`, key === 'file' ? (value as File).name : value);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    console.log("🚀 URL de upload:", uploadUrl);

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log("📡 Status do Cloudinary:", uploadResponse.status);

    if (!uploadResponse.ok) {
      let errorText = "Erro desconhecido no Cloudinary";
      try {
        const errorData: CloudinaryError = await uploadResponse.json();
        errorText = errorData.error?.message || JSON.stringify(errorData);
      } catch {
        errorText = await uploadResponse.text();
      }
      
      console.error("❌ Erro do Cloudinary:", errorText);
      throw new Error(`Falha no upload: ${errorText}`);
    }

    const data: CloudinaryUploadResponse = await uploadResponse.json();
    
    console.log("🎉 Upload concluído com sucesso!");
    console.log("📊 Detalhes:", {
      url: data.secure_url,
      public_id: data.public_id,
      tipo: data.resource_type,
      tamanho: formatFileSize(data.bytes)
    });

    return data.secure_url;

  } catch (error) {
    console.error("💥 Erro completo no processo de upload:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Erro de conexão. Verifique sua internet.");
    }
    
    throw error;
  }
}


// Função auxiliar para formatar tamanho de arquivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

