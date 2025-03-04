import UserAvatar from "@/components/UserAvatar";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { FollowInfo, getUserDataSelect, UserData } from "@/lib/types";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import UserPosts from "./UserPosts";
import InfoSidebar from "./InfoSidebar";
import EditProfileButton from "./EditProfileButton";
import bannerPlaceholder from "@/assests/cover_photo.png";
import Link from "next/link";
import Navigation from "./Navigation";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });
  if (!user) {
    notFound();
  }

  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `@${user.username} | Thinkhub`,
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return <p>You are not authorized to view this page</p>;

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <Navigation user={user} />
        <div className="mx-auto flex w-full min-w-0 max-w-6xl gap-5">
          <div className="sticky top-[9.5rem] hidden h-fit w-[28rem] flex-none space-y-5 rounded-2xl lg:block">
            <InfoSidebar
              loggedInUserId={loggedInUser.id}
              user={user}
              className="space-y-5 rounded-2xl border bg-card px-3 py-5 shadow-sm"
            />
            <FriendsList
              className="rounded-2xl border bg-card px-3 py-5 shadow-sm"
              userId={user.id}
            />
          </div>
          <div className="w-full min-w-0 space-y-5">
            <UserPosts userId={user.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ loggedInUserId, user }: UserProfileProps) {
  const followInfo: FollowInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="mx-auto flex h-fit w-full max-w-6xl flex-col rounded-b-2xl border bg-card">
      <div className="relative aspect-[16/9]">
        <Image
          src={user.banner || bannerPlaceholder}
          alt="coverphoto"
          height={1080}
          width={1920}
          className="object-cover object-top"
        />
      </div>
      <div className="flex w-full flex-col items-center gap-5 px-5 pb-5 md:h-28 md:flex-row">
        <div className="relative h-20 w-44 md:relative md:h-44">
          <UserAvatar
            size={500}
            avatarUrl={user.image}
            className="absolute -top-20 ring-4 ring-card md:-top-10"
          />
        </div>
        <div className="flex flex-grow justify-start">
          <div className="flex w-fit flex-col items-center md:block">
            <p className="text-3xl font-bold">{user.displayName}</p>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="text-sm">
              {formatNumber(user._count.followers)} followers
            </p>
          </div>
        </div>
        <div className="flex h-full items-end space-x-2">
          {user.id === loggedInUserId ? (
            <>
              <Button>
                <Plus /> Add to Story
              </Button>
              <EditProfileButton user={user} />
            </>
          ) : (
            <FollowButton userId={user.id} initialState={followInfo} />
          )}
        </div>
      </div>
    </div>
  );
}
interface FriendsListProps {
  userId: string;
  className?: string;
}
async function FriendsList({ userId, className }: FriendsListProps) {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: {
        select: getUserDataSelect(userId),
      },
    },
  });
  return (
    <div className={className}>
      <h1 className="text-center text-lg font-medium">Followers</h1>

      <div className="space-y-3">
        {followers.map(({ follower: user }) => (
          <Link
            key={user.id}
            href={`/user/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.image} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
