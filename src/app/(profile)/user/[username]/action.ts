"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserDataSelect } from "@/lib/types";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validation";

export async function updateProfile(input: UpdateProfileValues) {
  const validatedValues = updateProfileSchema.parse(input);
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
