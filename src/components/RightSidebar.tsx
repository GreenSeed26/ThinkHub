import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserDataSelect } from "@/lib/types";
import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";

export default function RightSidebar() {
  return (
    <div className="sticky top-[5.75rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <WhoToFollow />
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const userToFollow = await prisma.user.findMany({
    where: {
      id: {
        not: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>

      {userToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/user/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.image} className="flex-none" />

            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.username}
              </p>
            </div>
          </Link>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}
