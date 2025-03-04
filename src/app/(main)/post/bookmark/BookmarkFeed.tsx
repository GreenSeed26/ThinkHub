"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/post/Post";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import NoSavedPost from "./NoSavedPost";

export default function BookmarkFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmark-info"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/post/bookmark",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostPage>(),
    initialPageParam: null as null | string,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return <NoSavedPost />;
  }

  if (status === "error") {
    return <p>An error occured </p>;
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((p) => (
        <Post key={p.id} post={p} />
      ))}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}
