"use client";
import kyInstance from "@/lib/ky";
import { RequestInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import ApproveButton from "./ApproveButton";

export default function Requests({ groupId }: { groupId: string }) {
  const { data, status } = useQuery({
    queryKey: ["requests", groupId],
    queryFn: () =>
      kyInstance.get(`/api/group/${groupId}/request`).json<RequestInfo>(),
  });

  const requests = data?.requests.flatMap((req) => req) || [];

  if (status === "pending") {
    return <Loader2 className="size-5 animate-spin" />;
  }
  if (status === "error") {
    return <p>An error Occured</p>;
  }
  if (status === "success" && !requests?.length) {
    return <p>No Join Request</p>;
  }
  return (
    <div className="w-full bg-card">
      {requests?.map((request) => (
        <div key={request.id}>
          {request.user.username}
          <ApproveButton
            requestUserId={request.user.id}
            groupId={request.groupId}
            initialState={{ isApproved: request.status === "APPROVED" }}
          />
        </div>
      ))}
    </div>
  );
}
