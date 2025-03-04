import React, { cache } from "react";
import SideBar from "../SideBar";
import prisma from "@/lib/db";
import { getGroupDataInclude } from "@/lib/types";
import { validateRequest } from "@/lib/auth";
import Groups from "./Groups";

const getGroups = cache(async (loggedInUserId: string) => {
  const group = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: loggedInUserId,
        },
      },
    },
    include: getGroupDataInclude(loggedInUserId),
  });

  return group;
});

export default async function DiscoverPage() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return <p>You are not authorized to view this page</p>;

  const groups = await getGroups(loggedInUser.id);

  return (
    <div className="flex w-full max-w-full grow gap-5 sm:p-5">
      <SideBar
        className="sticky top-[5.75rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80"
        groups={groups}
      />
      <main className="mx-auto flex h-fit w-full max-w-7xl flex-col gap-5">
        <div>
          <Groups />
        </div>
        <div className="">hello</div>
      </main>
    </div>
  );
}
