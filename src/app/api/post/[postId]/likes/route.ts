import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LikeInfo } from "@/lib/types";
import { $Enums } from "@prisma/client";

interface AsyncParam {
  params: Promise<{ postId: string }>;
}
export async function GET(req: Request, { params }: AsyncParam) {
  const { postId } = await params;

  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          select: {
            userId: true,
            reaction: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    // Initialize reaction counts with all possible types
    const reactionCounts: Record<$Enums.ReactionType, number> = {
      LIKE: 0,
      HAHA: 0,
      ANGRY: 0,
      SAD: 0,
      WOW: 0,
    };

    // Count each reaction type
    post.likes.forEach(({ reaction }) => {
      reactionCounts[reaction] += 1;
    });

    // Find the user's reaction (if any)
    const userReaction =
      post.likes.find(({ userId }) => userId === loggedInUser.id)?.reaction ||
      null;

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!userReaction,
      reaction: userReaction,
      reactions: reactionCounts, // Complete reaction breakdown
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: AsyncParam) {
  const { postId } = await params;

  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });
    const { reaction } = await req.json(); // Get the reaction from the request body

    if (!reaction)
      return Response.json({ error: "Reaction is required" }, { status: 400 });

    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId,
          reaction,
        },
        update: { reaction },
      }),
      ...(loggedInUser.id !== post.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occured" }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: AsyncParam) {
  const { postId } = await params;

  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occured" }, { status: 500 });
  }
}
