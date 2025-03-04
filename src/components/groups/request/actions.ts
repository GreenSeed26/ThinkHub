"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function sendJoinRequest(data: { groupId: string }) {
  try {
    const { user } = await validateRequest();

    if (!user) return;

    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: data.groupId,
        },
      },
      select: {
        user: true,
      },
    });

    if (existingRequest?.user.id === user.id) {
      return;
    }

    const request = await prisma.joinRequest.create({
      data: {
        groupId: data.groupId,
        userId: user.id,
      },
    });
    return request;
  } catch (error) {
    console.error(error);
  }
}

export async function cancelJoinRequest(data: { groupId: string }) {
  try {
    const { user } = await validateRequest();
    if (!user) return;

    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: data.groupId,
        },
      },
    });

    if (!existingRequest) {
      console.log("No join request found to cancel");
      return;
    }

    await prisma.joinRequest.delete({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: data.groupId,
        },
      },
    });

    console.log("Join request canceled successfully");
    return;
  } catch (error) {
    console.error("Error canceling join request:", error);
  }
}
