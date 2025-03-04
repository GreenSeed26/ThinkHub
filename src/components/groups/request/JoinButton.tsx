"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { JoinInfo, RequestInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { cancelJoinRequest, sendJoinRequest } from "./actions";

interface JoinRequestButtonProps {
  groupId: string;
  isRequestSent: boolean;
}

export function JoinRequestButton({
  groupId,
  isRequestSent,
}: JoinRequestButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = ["join-request", groupId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`/api/group/${groupId}/request`)
        .json<{ isRequestSent: boolean }>(),
    initialData: { isRequestSent },
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: async ({ groupId }: { groupId: string }) =>
      data.isRequestSent
        ? cancelJoinRequest({ groupId })
        : sendJoinRequest({ groupId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<{
        isRequestSent: boolean;
      }>(queryKey);
      queryClient.setQueryData<{ isRequestSent: boolean }>(queryKey, () => ({
        isRequestSent: !previousState?.isRequestSent,
      }));

      return { previousState };
    },
    onError(error, vaiable, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    },
  });
  return (
    <Button
      variant={data.isRequestSent ? "ghost" : "default"}
      onClick={() => mutate({ groupId })}
    >
      {data.isRequestSent ? "Sent" : "Send"}
    </Button>
  );
}
