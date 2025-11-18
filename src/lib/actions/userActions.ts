"use server";

import { getUser } from "@/lib/services/User";

export async function actionGetUser(
  userId: number | string,
) {
  return await getUser(userId);
}

