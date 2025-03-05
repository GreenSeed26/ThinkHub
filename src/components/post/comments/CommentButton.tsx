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
        className="flex items-center gap-2 text-sm"
        onClick={() => setShowDialog(true)}
      >
        <MessageCircle className="size-5" /> Comment
      </button>
      <CommentDialog
        post={post}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
