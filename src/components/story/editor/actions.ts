"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStoryDataInclude } from "@/lib/types";
import { storySchema } from "@/lib/validation";

export async function createStory(image: {
  mediaIds: string[];
  fileUrl: string;
  fileType: "IMAGE" | "VIDEO";
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { mediaIds } = storySchema.parse(image);

  const activeStory = await prisma.story.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (activeStory) {
    return await prisma.storyMedia.create({
      data: {
        storyId: activeStory.id,
        mediaUrl: image.fileUrl,
        type: image.fileType,
      },
    });
  }

  const newStory = await prisma.story.create({
    data: {
      media: {
        connect: mediaIds.map((id) => ({
          id,
        })),
      },
      userId: user.id,
    },
    include: getStoryDataInclude(user.id),
  });

  return newStory;
}
