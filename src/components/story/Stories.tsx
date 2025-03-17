"use client";
import React from "react";
import UserAvatar from "../UserAvatar";
import avatarPlaceholder from "@/assests/user-icon.jpg";

import { StoryPage, UserData } from "@/lib/types";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import StorySkeleton from "./StorySkeleton";
import InfiniteScrollContainer from "../InfiniteScrollContainer";

export default function Stories({ user }: { user: UserData | undefined }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["stories"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "api/stories",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<StoryPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 5 * 60 * 1000,
  });

  const stories = data?.pages.flatMap((page) => page.stories) || [];
  console.log(stories);
  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="w-full px-2 sm:bg-background sm:px-0"
    >
      <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto">
        <Link
          href={"/story/create"}
          className="aspect-[9/16] h-52 rounded-2xl border shadow-md"
        >
          <div className="size-full rounded-2xl">
            <Image
              src={user?.image || avatarPlaceholder}
              width={200}
              height={200}
              alt={`${user?.displayName}'s Profile`}
              className="h-4/6 rounded-t-2xl object-cover"
            />
            <div className="flex h-2/6 flex-col items-center justify-center gap-1 rounded-b-2xl bg-card">
              <PlusIcon />
              <span className="text-sm">Create a Story</span>
            </div>
          </div>
        </Link>
        {stories.map((story) => (
          <Link
            href={`/story/${story.id}`}
            key={story.id}
            className="aspect-[9/16] h-52"
          >
            <div className="relative size-full rounded-2xl shadow-md">
              <Image
                src={story.media[0].mediaUrl}
                width={200}
                height={200}
                alt={`${user?.displayName}'s Profile`}
                className="h-full rounded-2xl border object-cover"
              />
              <div className="absolute left-0 top-0 flex size-full flex-col justify-between rounded-2xl px-3 py-2 transition-colors hover:bg-card/10">
                <UserAvatar
                  avatarUrl={story.user.image}
                  size={40}
                  className="ring-2 ring-primary"
                />
              </div>
              <div className="absolute bottom-0 h-10 w-full rounded-b-2xl bg-gradient-to-t from-black/90 to-white/0 p-2">
                <span className="text-sm font-medium text-white">
                  {story.user.displayName}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {status === "pending" && <StorySkeleton />}
      </div>
    </InfiniteScrollContainer>
  );
}
