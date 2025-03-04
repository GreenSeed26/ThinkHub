import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "./Navbar";
import MenuBar from "./Menu";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/signIn");

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full grow gap-5 sm:p-5">
          <MenuBar className="sticky top-[5.75rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
