import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface AsyncParams {
  params: Promise<{ postId: string }>;
}
export async function POST(res: Response, { params }: AsyncParams) {
  const { postId } = await params;
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.bookmark.upsert({
      where: {
        postId_userId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occured" }, { status: 500 });
  }
}

export async function DELETE(res: Response, { params }: AsyncParams) {
  const { postId } = await params;

  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.bookmark.deleteMany({
      where: {
        postId,
        userId: loggedInUser.id,
      },
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occured" }, { status: 500 });
  }
}
