"use client";
import GroupAvatar from "@/components/groups/GroupAvatar";
import { GroupData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface GroupParams {
  group: GroupData;
}
export default function Group({ group }: GroupParams) {
  return (
    <article className="w-full space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flew-wrap flex gap-3">
          <GroupAvatar avatarUrl={group.image} />
          <div>
            <Link
              href={`/group/${group.id}`}
              className="text-xl font-semibold hover:underline"
            >
              {group.name}
            </Link>
            <div className="flex gap-1">
              <span className="text-sm text-muted-foreground">
                {group.privacy === "PUBLIC" ? "Public Group" : "Private Group"}{" "}
                &bull;
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(group._count.members)} member(s)
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
