"use client";
import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import React from "react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  initialState,
  postId,
}: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`api/post/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/post/${postId}/bookmark`).json<BookmarkInfo>()
        : kyInstance.post(`/api/post/${postId}/bookmark`).json<BookmarkInfo>(),
    onMutate: async () => {
      toast({
        description: data.isBookmarkedByUser ? "Post unsaved" : "Post saved",
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });
  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "animate-like fill-primary text-primary",
        )}
      />
    </button>
  );
}
