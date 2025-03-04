import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getGroupDataInclude, DiscoverGroupPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: {
        members: {
          none: {
            userId: loggedInUser.id,
          },
        },
      },
      include: getGroupDataInclude(loggedInUser.id),
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = groups.length > pageSize ? groups[pageSize].id : null;

    const data: DiscoverGroupPage = {
      groups: groups.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occured" }, { status: 500 });
  }
}
