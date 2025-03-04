"use client";
import { GroupData } from "@/lib/types";
import React from "react";
import GroupAvatar from "@/components/groups/GroupAvatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompassIcon, Newspaper, Plus, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
interface SideBarProps {
  groups: GroupData[];
  className?: string;
}
export default function SideBar({ groups, className }: SideBarProps) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <div className="flex items-center justify-start gap-3 text-lg">
        <Users /> <span className="hidden text-2xl lg:inline">Groups</span>
      </div>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center justify-start gap-3 text-lg",
          pathname === "/group" && "bg-muted text-primary",
        )}
        title="Feed"
        asChild
      >
        <Link href="/group">
          <Newspaper />
          <span className="hidden lg:inline"> Feed</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center justify-start gap-3 text-lg",
          pathname === "/group/discover" && "bg-muted text-primary",
        )}
        title="Discover"
        asChild
      >
        <Link href="/group/discover" replace>
          <CompassIcon /> <span className="hidden lg:inline">Discover</span>
        </Link>
      </Button>
      <Button
        className="w-full bg-primary-foreground text-primary"
        variant="ghost"
        asChild
      >
        <Link href={"/group/create"} replace>
          <Plus />
          <span className="hidden lg:inline">Create new group</span>
        </Link>
      </Button>
      <Separator />

      <div className="space-y-3">
        <h1>Groups you&apos;ve joined</h1>
        {groups.map((group) => (
          <div key={group.id} className="flex lg:gap-2">
            <GroupAvatar
              size={52}
              className="rounded-md"
              avatarUrl={group.image}
            />
            <div>
              <Link
                href={`/group/${group.id}`}
                className="line-clamp-2 hidden text-sm font-bold hover:underline lg:block"
                title={group.name}
              >
                {group.name}
              </Link>
            </div>
          </div>
        ))}
        {!groups.length && (
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any groups yet. Join A group or create one
          </p>
        )}
      </div>
    </div>
  );
}
