import { prisma } from "@/lib/db";
import React, { cache } from "react";
import { validateRequest } from "@/lib/auth";
import Editor from "@/components/groups/editor/Editor";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGroupDataInclude, getUserDataSelect, GroupData } from "@/lib/types";
import Image from "next/image";
import bannerPlaceholder from "@/assests/cover_photo.png";
import { formatNumber } from "@/lib/utils";
import { Check, Globe2, Lock, UserPlus } from "lucide-react";
import GroupPost from "./GroupPost";
import { Button } from "@/components/ui/button";
import UpdateImage from "./EditGroupProfileDialog";
import EditGroupButton from "./EditGroupButton";
import { JoinRequestButton } from "@/components/groups/request/JoinButton";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

interface PageParams {
  params: Promise<{ groupId: string }>;
}

export const getGroup = cache(
  async (groupId: string, loggedInUserId: string) => {
    const group = await prisma.group.findFirst({
      where: { id: groupId },
      include: getGroupDataInclude(loggedInUserId),
    });
    if (!group) {
      notFound();
    }
    return group;
  },
);

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { groupId } = await params;
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const group = await getGroup(groupId, loggedInUser.id);
  return { title: `${group.name} | Thinkhub` };
}

export default async function Page({ params }: PageParams) {
  const { groupId } = await params;
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return <p>You are not authorized to view this page</p>;

  const group = await getGroup(groupId, loggedInUser.id);

  const membership = group.members.find((m) => m.userId === loggedInUser.id);
  const isMember = Boolean(membership);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <GroupInfo groupId={group.id} loggedInUserId={loggedInUser.id} />

        <div className="mx-auto flex w-full min-w-0 max-w-6xl gap-5">
          <div className="sticky top-[5.5rem] hidden h-fit w-full max-w-md flex-none space-y-5 rounded-2xl md:block">
            <div className="space-y-5 rounded-2xl border bg-card px-3 py-5 shadow-sm">
              <h1 className="font-semibold">About</h1>
              <div className="text-sm">{group.description}</div>
              <span className="my-2 flex gap-2 font-bold">
                <Globe2 />
                {group.privacy === "PUBLIC" ? "Public" : "Private"}
              </span>
              <span className="text-sm">
                {group.privacy === "PUBLIC"
                  ? "Anyone can see who's in the group and what they post."
                  : "Only members can see who's in the group and what they post"}
              </span>
            </div>
            <div className="rounded-2xl border bg-card px-3 py-5 shadow-sm">
              HELLO
            </div>
          </div>
          <div className="w-full min-w-0 space-y-5">
            {isMember && <Editor groupId={groupId} />}
            <GroupFeed group={group} loggedInUserId={loggedInUser.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface GroupInfoProps {
  groupId: string;
  loggedInUserId: string;
}

async function GroupInfo({ groupId, loggedInUserId }: GroupInfoProps) {
  const group = await getGroup(groupId, loggedInUserId);

  const membership = group.members.find((m) => m.userId === loggedInUserId);
  const isMember = Boolean(membership);
  const isAdmin = membership?.role === "ADMIN";

  return (
    <div className="mx-auto flex h-fit w-full max-w-6xl flex-col rounded-b-2xl border bg-card">
      <div className="relative aspect-[16/9]">
        <Image
          src={group.image || bannerPlaceholder}
          alt="coverphoto"
          fill
          sizes="(min-width: 1220px) 1153px, calc(94.67vw + 15px)"
          className="object-cover object-top"
        />
      </div>
      <div className="flex h-fit w-full flex-col items-center gap-5 px-5 pb-5 md:flex-row">
        <div className="flex flex-grow justify-start">
          <div className="flex w-fit flex-grow flex-col items-center space-y-1 md:block">
            <p className="py-2 text-3xl font-bold">{group.name}</p>
            <div className="flex gap-2">
              {group.privacy === "PUBLIC" ? (
                <span className="flex gap-2 text-sm text-muted-foreground">
                  <Globe2 className="size-5" /> Public
                </span>
              ) : (
                <span className="flex gap-2 text-sm text-muted-foreground">
                  <Lock className="size-5" /> Private
                </span>
              )}
              <p className="text-sm text-muted-foreground">
                &bull; {formatNumber(group._count.members)} members
              </p>
            </div>
            <div className="flex -space-x-2">
              {group.members.map((member) => (
                <Link
                  href={`/user/${member.user.username}`}
                  key={member.user.id}
                  className="relative"
                >
                  <UserAvatar
                    className="ring-2 ring-card hover:ring-white/80"
                    avatarUrl={member.user.image}
                    size={30}
                  />
                  <div className="absolute top-0 size-full rounded-full bg-white opacity-0 transition-opacity hover:opacity-30"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-full items-end space-x-2">
          <Button>
            Invite <UserPlus className="size-5" />
          </Button>
          {isAdmin ? (
            <EditGroupButton group={group} />
          ) : isMember ? (
            <Button variant="outline">
              <Check /> Joined
            </Button>
          ) : (
            <JoinRequestButton
              groupId={group.id}
              isRequestSent={group.joinRequests.length > 0}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface GroupFeedProps {
  group: GroupData;
  loggedInUserId: string;
}

async function GroupFeed({ group, loggedInUserId }: GroupFeedProps) {
  const groupAdminData = await prisma.group.findFirst({
    where: { id: group.id },
    select: {
      members: {
        where: { role: "ADMIN" },
        select: {
          user: { select: getUserDataSelect(loggedInUserId) },
        },
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  const admins = groupAdminData?.members.map((member) => member.user) || [];
  const creator = admins.length > 0 ? admins[0] : null;

  return (
    <div className="w-full min-w-0 space-y-5">
      <GroupPost groupId={group.id} />
      <CreatedBy
        groupName={group.name}
        creator={creator?.username ?? "Unknown"}
      />
    </div>
  );
}
function CreatedBy({
  groupName,
  creator,
}: {
  groupName: string;
  creator: string;
}) {
  return (
    <div className="flex w-full items-center justify-center space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div>
        <span className="font-bold">{creator}</span> created the group{" "}
        <span className="font-bold">{groupName}</span>
      </div>
    </div>
  );
}
