"use client";

import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/post/Post";

export default function GroupPost({ groupId }: { groupId: string }) {
  const { data, status, hasNextPage, isFetching, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["group-feed", groupId],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/group/${groupId}/posts`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <Loader2 className="animate-spin" />;
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">No one has posted</p>
    );
  }
  if (status === "error") {
    return <p>An error Occured</p>;
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </InfiniteScrollContainer>
  );
}
