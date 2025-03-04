"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LogOutIcon, Moon, Settings, Sun, User2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { UserData } from "@/lib/types";

interface UserButtonProps {
  className?: string;
  user: UserData | undefined;
}

export default function UserButton({ className, user }: UserButtonProps) {
  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user?.image} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/user/${user?.username}`}>
          <DropdownMenuItem>
            <div className="mr-2 rounded-full bg-card p-2">
              <User2 />
            </div>
            Profile
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem>
            <div className="mr-2 rounded-full bg-card p-2">
              <Settings />
            </div>
            Settings & Privacy
          </DropdownMenuItem>
        </Link>

        <Link href="/settings/accessibility">
          <DropdownMenuItem>
            <div className="mr-2 rounded-full bg-card p-2">
              {theme === "dark" ? <Moon /> : <Sun />}
            </div>
            Display & Accessibility
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <div className="mr-2 rounded-full bg-card p-2">
            <Moon />
          </div>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <div className="mr-2 rounded-full bg-card p-2">
            <Sun />
          </div>
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            signOut();
          }}
        >
          <div className="mr-2 rounded-full bg-card p-2">
            <LogOutIcon />
          </div>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
