import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApprovalInfo, getUserDataSelect } from "@/lib/types";

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

    const request = await prisma.joinRequest.findUnique({
      where: {
        userId_groupId: {
          groupId,
          userId: user.id,
        },
      },
    });

    if (!request) {
      return Response.json({ error: "No request" }, { status: 404 });
    }

    const data: ApprovalInfo = {
      isApproved: request.status === "APPROVED",
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

    const { requestUserId } = await req.json();
    if (!requestUserId) {
      return Response.json({ error: "No user to approve" }, { status: 400 });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: {
        userId_groupId: {
          userId: requestUserId,
          groupId,
        },
      },
    });
    if (!joinRequest || joinRequest.status !== "PENDING") {
      return Response.json(
        { error: "No pending request for this user" },
        { status: 404 },
      );
    }

    // 4. Check if the user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: { userId: requestUserId, groupId },
      },
    });
    if (existingMember) {
      return Response.json(
        { error: "User is already a member" },
        { status: 400 },
      );
    }

    // 5. Approve the user:
    //    - Add them to groupMember
    //    - Delete the joinRequest
    await prisma.$transaction([
      prisma.groupMember.create({
        data: {
          userId: requestUserId,
          groupId,
          role: "MEMBER",
        },
      }),
      prisma.joinRequest.delete({
        where: {
          userId_groupId: {
            userId: requestUserId,
            groupId,
          },
        },
      }),
    ]);

    return Response.json(
      { message: "Request approved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
}
