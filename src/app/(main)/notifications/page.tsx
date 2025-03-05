import RightSidebar from "@/components/RightSidebar";
import { Metadata } from "next";
import Notifications from "./Notifications";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 justify-between gap-5">
      <div className="mx-auto w-full min-w-0 max-w-2xl space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <RightSidebar />
    </main>
  );
}
