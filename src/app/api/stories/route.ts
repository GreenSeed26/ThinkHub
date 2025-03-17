import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStoryDataInclude, StoryPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const user = session?.user;

    if (!user) throw Response.json({ error: "Unauthorized" }, { status: 401 });

    const stories = await prisma.story.findMany({
      include: getStoryDataInclude(user.id),
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = stories.length > pageSize ? stories[pageSize].id : null;

    const data: StoryPage = {
      stories: stories.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
