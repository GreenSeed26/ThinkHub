"use client";
import GroupAvatar from "@/components/groups/GroupAvatar";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { DiscoverGroupPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Groups() {
  const { data, status, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["discover-groups"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/group",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<DiscoverGroupPage>(),
      initialPageParam: null as null | string,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const groups = data?.pages.flatMap((page) => page.groups) || [];
  if (status === "pending") {
    return <Loader2 className="animate-spin" />;
  }
  if (status === "success" && !groups.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No groups has been created yet.
      </p>
    );
  }
  if (status === "error") {
    return <p>An error Occured</p>;
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-6 border-red-500"
    >
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex flex-col overflow-hidden rounded-xl bg-card shadow-lg"
        >
          <GroupAvatar
            className="aspect-[16/9] w-full rounded-t-2xl"
            avatarUrl={group.image}
            size={288}
          />
          <div className="flex flex-col p-4 md:flex-grow">
            <Link
              href={`/group/${group.id}`}
              className="line-clamp-3 overflow-hidden text-lg font-semibold hover:underline"
            >
              {group.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {group._count.members} members •{" "}
              {group.privacy === "PUBLIC" ? "Public" : "Private"} Group
            </p>
            <button className="mt-auto w-full rounded-lg bg-muted py-2 hover:bg-muted-foreground/50">
              Join group
            </button>
          </div>
        </div>
      ))}
    </InfiniteScrollContainer>
  );
}
