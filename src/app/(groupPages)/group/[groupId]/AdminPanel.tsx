import { Button } from "@/components/ui/button";
import { GroupData } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default async function AdminPanel({ group }: { group: GroupData }) {
  return (
    <div className="space-y-3">
      <h1>Pending Requests</h1>
      <Button variant="ghost" className="w-full justify-start" asChild>
        <Link
          className="flex justify-between"
          href={`/group/${group.id}/requests`}
        >
          Join Requests
          <span className="text-primary">{group._count.joinRequests}</span>
        </Link>
      </Button>
    </div>
  );
}
