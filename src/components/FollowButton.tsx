"use client";
import { useToast } from "@/hooks/use-toast";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";

interface FollowButtonProps {
  userId: string;
  initialState: FollowInfo;
}

export default function FollowButton({
  initialState,
  userId,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowInfo>(queryKey);

      queryClient.setQueryData<FollowInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },

    onError(err, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(err);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again later",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => {
        mutate();
      }}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
