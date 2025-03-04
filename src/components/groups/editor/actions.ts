"use server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";
import { postSchema } from "@/lib/validation";

interface CreatePostProp {
  input: {
    content: string;
  };
  groupId: string;
}

export async function createGroupPost({ groupId, input }: CreatePostProp) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");
  const { content } = postSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      groupId: groupId,
      content,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
