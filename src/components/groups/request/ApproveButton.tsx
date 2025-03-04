"use client";
import kyInstance from "@/lib/ky";
import { ApprovalInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import useApproveInfo from "./useApproveInfo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ApproveButton({
  requestUserId,
  groupId,
  initialState,
}: {
  requestUserId: string;
  groupId: string;
  initialState: ApprovalInfo;
}) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["join-approval", groupId];

  const { data } = useApproveInfo(groupId, initialState);

  const { mutate } = useMutation({
    mutationFn: () =>
      kyInstance.post(`/api/group/${groupId}/approval`, {
        json: {
          requestUserId,
        },
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<ApprovalInfo>(queryKey);
      queryClient.setQueryData<ApprovalInfo>(queryKey, () => ({
        isApproved: !previousState?.isApproved,
      }));

      return { previousState };
    },

    onError(error, vairable, context) {
      queryClient.invalidateQueries({ queryKey });
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
      className={cn(data.isApproved && "bg-primary-foreground")}
      onClick={() => mutate()}
    >
      <p className={cn(data.isApproved && "text-primary")}>
        {data.isApproved ? "Approved" : "Approve"}
      </p>
    </Button>
  );
}
