
import { Client } from "@/lib/types/userType";
import { updateUser } from "@/lib/services/User";

export async function switchActiveClient(client: Client) {
    const updatedClient = { ...client, is_active: !client.is_active };

    try {
      await updateUser(
        client.id,
        client.name,
        client.email,
        undefined, 
        { whatsapp: client.profile?.whatsapp ?? null }, 
        updatedClient.is_active, 
        undefined,
        undefined
      );
      return updatedClient;
    } catch (error) {
      console.error("Failed to update client status:", error);
      throw error
    }
}