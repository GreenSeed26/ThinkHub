"use client";

import UserAvatar from "@/components/UserAvatar";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";
import LinkButton from "./LinkButton";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
interface NavProps {
  user: UserData;
}

export default function Navigation({ user }: NavProps) {
  const { ref, inView } = useInView({
    initialInView: true,
  });

  return (
    <>
      <div ref={ref} />
      <div className="sticky top-[4.5rem] w-full">
        <div
          className={cn(
            "mx-auto bg-card transition-all duration-300",
            inView
              ? "w-full max-w-6xl rounded-2xl border"
              : "w-full max-w-full rounded-none border-b",
          )}
        >
          {inView ? (
            <nav className="mx-auto w-full max-w-6xl pl-3">
              <LinkButton href={`${user.username}`} className="w-24 p-3">
                Posts
              </LinkButton>
              <LinkButton href={`${user.username}/photos`} className="w-24 p-3">
                Photos
              </LinkButton>
              <LinkButton
                href={`${user.username}/friends`}
                className="w-24 p-3"
              >
                Friends
              </LinkButton>
            </nav>
          ) : (
            <div className="mx-auto flex max-w-7xl items-center justify-between p-1">
              <div className={cn("flex items-center gap-3")}>
                <UserAvatar avatarUrl={user.image} />
                <span className="text-xl font-bold">{user.displayName}</span>
              </div>
              <Button variant="ghost">
                <MoreHorizontal />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
