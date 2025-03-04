import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getJoinRequestDataSelect, RequestInfo } from "@/lib/types";

interface AsyncParam {
  params: Promise<{ groupId: string }>;
}
export async function GET(req: Request, { params }: AsyncParam) {
  const { groupId } = await params;

  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.joinRequest.findMany({
      where: {
        groupId,
        status: "PENDING",
      },
      select: getJoinRequestDataSelect(user.id),
    });

    const data: RequestInfo = {
      requests,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error Occured" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: AsyncParam) {
  const { groupId } = await params;

  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }

    await prisma.joinRequest.upsert({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId,
        },
      },
      create: {
        userId: user.id,
        groupId,
        status: "PENDING",
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: AsyncParam) {
  const { groupId } = await params;

  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }

    await prisma.joinRequest.deleteMany({
      where: {
        userId: user.id,
        groupId,
        status: "PENDING",
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
}
