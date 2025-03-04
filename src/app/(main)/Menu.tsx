import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Users2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Notifications"
        asChild
      >
        <Link href="/notification">
          <Bell />
          <span className="hidden lg:inline"> Notifications</span>
        </Link>
      </Button>
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
