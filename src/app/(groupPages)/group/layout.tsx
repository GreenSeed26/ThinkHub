import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/app/(main)/Navbar";

export default async function ProfileLayout({
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

        {children}
      </div>
    </SessionProvider>
  );
}
