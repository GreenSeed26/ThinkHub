import { BookmarkX } from "lucide-react";
import React from "react";

export default function NoSavedPost() {
  return (
    <div className="flex flex-col items-center justify-center">
      <BookmarkX className="size-32 text-muted" />
      <p className="text-2xl font-bold text-muted">No Saved Post</p>
    </div>
  );
}
