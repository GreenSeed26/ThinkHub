import Editor from "@/components/post/editor/Editor";
import PostFeed from "@/components/post/Feed";
import RightSidebar from "@/components/RightSidebar";
import { validateRequest } from "@/lib/auth";
import { getUser } from "./Navbar";
import Stories from "@/components/story/Stories";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) return;

  const userData = await getUser(user.id);
  return (
    <main className="flex w-full min-w-0 justify-between gap-5">
      <div className="mx-auto w-full max-w-2xl space-y-3">
        <Editor user={userData} />
        <Stories user={userData} />
        <PostFeed />
      </div>
      <RightSidebar />
    </main>
  );
}
