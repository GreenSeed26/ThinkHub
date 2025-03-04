import React, { cache } from "react";
import GroupList from "./GroupList";
import RightSidebar from "@/components/RightSidebar";
import CreateGroup from "./create/CreateGroup";
import SideBar from "./SideBar";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { getGroupDataInclude } from "@/lib/types";

const getGroups = cache(async (loggedInUserId: string) => {
  const group = await prisma.group.findMany({
    include: getGroupDataInclude(loggedInUserId),
  });

  return group;
});

export default async function GroupsPage() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return <p>You are not authorized to view this page</p>;

  const groups = await getGroups(loggedInUser.id);

  return (
    <div className="flex w-full max-w-full grow gap-5 sm:p-5">
      <SideBar
        groups={groups}
        className="sticky top-[5.75rem] hidden h-fit w-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80"
      />
      <main className="mx-auto flex w-full max-w-3xl gap-5">
        <div className="w-full min-w-0 space-y-5">
          <GroupList />
        </div>
      </main>
    </div>
  );
}
