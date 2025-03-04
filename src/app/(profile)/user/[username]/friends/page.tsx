import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import React, { cache } from "react";

const getFriends = cache(async (username: string) => {
  const friends = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: {
      followers: {
        select: { follower: true },
      },
    },
  });

  if (!friends) notFound();

  return friends;
});

interface PageProp {
  params: Promise<{ username: string }>;
}

export default async function Friends({ params }: PageProp) {
  const { username } = await params;

  const { user } = await validateRequest();

  if (!user) return <p>Unauthorized</p>;
  const friends = await getFriends(user.username);

  return (
    <div className="mx-auto max-w-7xl">
      {friends.followers.map(({ follower }) => follower.username)}
    </div>
  );
}
