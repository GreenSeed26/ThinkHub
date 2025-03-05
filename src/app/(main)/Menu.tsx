import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Bell, Bookmark, Home, Users2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import Notification from "./notifications/Notification";
import NotificationsButton from "./NotifcationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline"> Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/post/bookmark">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Groups"
        asChild
      >
        <Link href="/group">
          <Users2 />
          <span className="hidden lg:inline">Groups</span>
        </Link>
      </Button>
    </div>
  );
}
