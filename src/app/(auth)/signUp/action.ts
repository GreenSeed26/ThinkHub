"use server";

import { prisma } from "@/lib/db";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "bcrypt-ts";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { email, password, username } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, 10);

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "Email Already Taken" };
    }

    await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
        displayName: username.toLowerCase(),
      },
    });

    redirect("/signIn");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again",
    };
  }
}
