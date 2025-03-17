import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStoryDataInclude } from "@/lib/types";

interface AsyncParms {
  params: Promise<{ storyId: string }>;
}
export async function GET(req: Request, { params }: AsyncParms) {
  const { storyId } = await params;

  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 500 });

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
      include: getStoryDataInclude(user.id),
    });

    return Response.json(story);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occured" }, { status: 401 });
  }
}
