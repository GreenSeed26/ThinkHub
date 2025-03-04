import RightSidebar from "@/components/RightSidebar";
import BookmarkFeed from "./BookmarkFeed";

export default function Bookmark() {
  return (
    <main className="flex w-full min-w-0 justify-between gap-5">
      <div className="mx-auto w-full min-w-0 max-w-2xl space-y-5">
        <h1 className="text-2xl font-bold">Bookmarked</h1>
        <BookmarkFeed />
      </div>
      <RightSidebar />
    </main>
  );
}
