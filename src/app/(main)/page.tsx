import Editor from "@/components/post/editor/Editor";
import PostFeed from "@/components/post/Feed";
import RightSidebar from "@/components/RightSidebar";
import { validateRequest } from "@/lib/auth";
import { getUser } from "./Navbar";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) return;

  const userData = await getUser(user.id);
  return (
    <main className="flex w-full min-w-0 justify-between gap-5">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <Editor user={userData} />
        <PostFeed />
      </div>
      <RightSidebar />
    </main>
  );
}
