import SearchInput from "@/components/SearchInput";
import UserButton from "@/components/UserButton";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { getUserDataSelect } from "@/lib/types";
import Link from "next/link";
import React, { cache } from "react";

export const getUser = cache(async (loggedInUserId: string) => {
  const userData = await prisma.user.findUnique({
    where: { id: loggedInUserId },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!userData) return;

  return userData;
});

export default async function Navbar() {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const userInfo = await getUser(user.id);

  return (
    <header className="sticky top-0 z-10 border-b bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-3 sm:flex-wrap sm:gap-5">
        <Link href="/" className="text-2xl font-bold text-primary">
          MIS
        </Link>
        <SearchInput />
        <UserButton user={userInfo} className="sm:ms-auto" />
      </div>
    </header>
  );
}
