"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createStory(input: { content: string }) {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauhtorized");

    const story = await prisma.story.create({
      data: {
        content: input.content,
        userId: user.id,
      },
    });
  } catch (error) {}
}
