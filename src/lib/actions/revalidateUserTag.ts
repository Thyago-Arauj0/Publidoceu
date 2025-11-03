"use server";

import { revalidateTag } from "next/cache";

export async function revalidateUserTag(tag: string) {
  revalidateTag(tag);
}
