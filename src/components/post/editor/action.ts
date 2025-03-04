"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";
import { postSchema } from "@/lib/validation";

export async function createPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = postSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
