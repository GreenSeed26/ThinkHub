"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { CommentData, CommentsPage, PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { relativeDateFormat } from "@/lib/utils";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { Loader2 } from "lucide-react";
interface CommentDialogProps {
  post: PostData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function CommentDialog({
  onOpenChange,
  post,
  open,
}: CommentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-full sm:h-auto">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <div className="relative flex h-full min-h-[32rem] flex-col sm:max-h-[36rem]">
          <div className="h-full overflow-y-auto">
            <Comments post={post} />
          </div>
        </div>
        <div className="">
          <CommentInput post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Comments({ post }: { post: PostData }) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance(
          `/api/post/${post.id}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        ).json<CommentsPage>(),
      initialPageParam: null as null | string,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "pending") return <Loader2 className="mx-auto animate-spin" />;

  if (status === "success" && !comments.length)
    return (
      <p className="text-center text-muted-foreground">No comments yet.</p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An error occurred while loading comments.
      </p>
    );

  return (
    <InfiniteScrollContainer
      className="space-y-3"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </InfiniteScrollContainer>
  );
}

function Comment({ comment }: { comment: CommentData }) {
  return (
    <div className="group/comment flex gap-3 py-3">
      <UserAvatar avatarUrl={comment.user.image} size={40} />

      <div className="flex w-full flex-col">
        <div className="flex items-center gap-1 text-sm">
          <Link
            href={`/users/${comment.user.username}`}
            className="font-medium hover:underline"
          >
            {comment.user.displayName}
          </Link>
          <span className="text-xs text-muted-foreground">
            {relativeDateFormat(comment.createdAt)}
          </span>
        </div>

        <div className="break-words">{comment.content}</div>
      </div>
    </div>
  );
}
