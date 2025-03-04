import React from "react";
import { getGroup } from "./page";
import { validateRequest } from "@/lib/auth";
import AdminPanel from "./AdminPanel";

export default async function GroupInfoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return;
  const group = await getGroup(groupId, loggedInUser?.id);
  const isAdmin = group.members.some(
    (member) => member.userId === loggedInUser?.id && member.role === "ADMIN",
  );
  return (
    <div className="flex min-h-screen">
      <div className="mx-auto flex w-full grow gap-5">
        {isAdmin && (
          <div className="sticky top-[5.75rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80">
            <AdminPanel group={group} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
