"use server"

import { createUser, updateUser, deleteUser } from "@/lib/services/User";
import { formatWhatsapp } from "@/lib/helpers/formatWhatsapp";

export async function actionCreateClient(formData: any) {
  return await createUser(
    formData.name,
    formData.email,
    formData.password,
    null,
    null
  );
}

export async function actionUpdateClient(editingClient: any, formData: any) {
  return await updateUser(
    editingClient.id,
    formData.name,
    formData.email,
    formData.password || undefined,
    { whatsapp: formatWhatsapp(formData.phone) },
    editingClient.is_active,
    null,
    null
  );
}

export async function actionDeleteClient(clientId: string | number) {
  return await deleteUser(clientId);
}
