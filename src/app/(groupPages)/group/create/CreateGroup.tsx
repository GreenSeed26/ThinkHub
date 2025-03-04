"use client";

import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { createGroup } from "../action";

export default function CreateGroup() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await createGroup({
        name,
        description,
        privacy,
        requiresApproval,
      });

      if (error) {
        toast({
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          description: "Group created",
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Group Name</label>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Privacy Select */}
      <div>
        <label className="block text-sm font-medium">Visibility</label>
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value as "PUBLIC" | "PRIVATE")}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      {/* Requires Approval Checkbox */}
      {/* <div className="flex items-center space-x-2">
        <Checkbox
          checked={requiresApproval}
          onCheckedChange={(checked) => setRequiresApproval(checked)}
        />
        <label className="text-sm font-medium">Requires Approval</label>
      </div> */}

      <LoadingButton loading={isPending} type="submit" className="w-full">
        Create
      </LoadingButton>
    </form>
  );
}
