"use client";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { joinGroup } from "./action";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGroupInfo } from "./useGroupInfo";
import { JoinInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";

interface JoinButtonProps {
  userId: string;
  groupId: string;
  initialState: JoinInfo;
}

export default function JoinButton({ groupId, initialState }: JoinButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["join-info", groupId];
  const { data } = useGroupInfo(groupId, initialState);

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isJoined
        ? kyInstance.delete(`/api/group/${groupId}/join`)
        : kyInstance.post(`/api/group/${groupId}/join`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<JoinInfo>(queryKey);

      queryClient.setQueryData<JoinInfo>(queryKey, () => ({
        isJoined: !previousState?.isJoined,
      }));

      return { previousState };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError(err, _, context) {
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
      variant={data.isJoined ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isJoined ? "Joined" : "Join"}
    </Button>
  );
}
