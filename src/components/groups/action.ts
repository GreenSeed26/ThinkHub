"use server";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { error } from "console";

interface JoinGroupParams {
  groupId: string;
}

export async function joinGroup({ groupId }: JoinGroupParams) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) throw new Error("Unauthorized");

  const existingMember = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: loggedInUser.id,
        groupId,
      },
    },
  });

  if (existingMember) return { error: "Already a member" };

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      privacy: true,
      requiresApproval: true,
    },
  });

  if (!group) return { error: "Group not Found" };

  if (group.privacy === "PUBLIC") {
    const join = await prisma.groupMember.create({
      data: { userId: loggedInUser.id, groupId, role: "MEMBER" },
    });

    return join;
  }

  if (group.requiresApproval) {
    const existingRequest = await prisma.joinRequest.findUnique({
      where: { userId_groupId: { userId: loggedInUser.id, groupId } },
    });

    if (existingRequest) {
      return { message: "Join request already sent" };
    }

    const requestJoin = await prisma.joinRequest.create({
      data: { userId: loggedInUser.id, groupId, status: "PENDING" },
    });

    return requestJoin;
  }
  return { error: "Unexpected Error" };
}
