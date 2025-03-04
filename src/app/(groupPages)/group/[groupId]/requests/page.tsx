import Requests from "@/components/groups/request/Requests";
import React from "react";
interface RequestPageParams {
  params: Promise<{ groupId: string }>;
}

export default async function RequestPage({ params }: RequestPageParams) {
  const { groupId } = await params;
  return (
    <div className="mx-auto flex h-fit w-full max-w-6xl flex-col border bg-card">
      <Requests groupId={groupId} />
    </div>
  );
}
