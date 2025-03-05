"use client";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import CommentDialog from "./CommentDialog";
import { PostData } from "@/lib/types";

interface CommentButtonProps {
  post: PostData;
}
export default function CommentButton({ post }: CommentButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <button
        className="flex items-center gap-2"
        onClick={() => setShowDialog(true)}
      >
        <MessageCircle className="size-5" />
        <span className="text-sm font-medium tabular-nums">
          {post._count.comments}{" "}
          <span className="hidden sm:inline">Comments</span>
        </span>
      </button>
      <CommentDialog
        post={post}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
