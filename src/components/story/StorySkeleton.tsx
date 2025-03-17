import React from "react";

export default function StorySkeleton() {
  return (
    <>
      <div className="aspect-[9/16] h-52">
        <div className="size-full animate-pulse rounded-2xl bg-card"></div>
      </div>
      <div className="aspect-[9/16] h-52">
        <div className="size-full animate-pulse rounded-2xl bg-card"></div>
      </div>
      <div className="aspect-[9/16] h-52">
        <div className="size-full animate-pulse rounded-2xl bg-card"></div>
      </div>
      <div className="aspect-[9/16] h-52">
        <div className="size-full animate-pulse rounded-2xl bg-card"></div>
      </div>
      <div className="aspect-[9/16] h-52">
        <div className="size-full animate-pulse rounded-2xl bg-card"></div>
      </div>
    </>
  );
}
