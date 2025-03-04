import { SessionProvider } from "next-auth/react";
import Navbar from "../(main)/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/signIn");
  return (
    <SessionProvider>
      <Navbar />

      {children}
    </SessionProvider>
  );
}
