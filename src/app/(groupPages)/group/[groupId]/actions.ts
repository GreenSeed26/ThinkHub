"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getGroupDataInclude } from "@/lib/types";
import {
  updateGroupProfileSchema,
  UpdateGroupProfileValues,
} from "@/lib/validation";
interface GroupParams {
  input: UpdateGroupProfileValues;
  groupId: string;
}
export async function updateGroupProfile({ groupId, input }: GroupParams) {
  const validatedValues = updateGroupProfileSchema.parse(input);
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");
  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: validatedValues,
    include: getGroupDataInclude(user.id),
  });

  return updatedGroup;
}
