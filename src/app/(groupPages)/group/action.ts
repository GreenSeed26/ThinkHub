"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createGroupSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function createGroup(input: {
  name: string;
  description: string;
  privacy: "PUBLIC" | "PRIVATE";
}): Promise<{ error: string }> {
  try {
    const { user } = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const { description, privacy, name } = createGroupSchema.parse(input);

    const group = await prisma.group.create({
      data: {
        name,
        description,
        requiresApproval: false,
        privacy,
        members: {
          create: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
    });

    if (!group) return { error: "Failed to create group!" };

    redirect(`/group/${group.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again later",
    };
  }
}
