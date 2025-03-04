import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { loginSchema } from "./validation";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      banner: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = await loginSchema.parseAsync(credentials);
        const existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
          include: {
            group: true,
          },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(password, existingUser.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.username,
          image: existingUser.image,
          banner: existingUser.banner,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        };
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn" },
});

export async function validateRequest() {
  const session = await auth();

  return {
    user: session?.user,
    session,
  };
}
