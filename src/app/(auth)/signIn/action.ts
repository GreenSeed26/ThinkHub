"use server";

import prisma from "@/lib/db";
import { loginSchema, LoginValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/lib/auth";
import { compare } from "bcrypt-ts";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { email, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.password) {
      return {
        error: "Incorrect username or password",
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again later",
    };
  }
}
