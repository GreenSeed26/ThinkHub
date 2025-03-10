import React from "react";
import UserAvatar from "../UserAvatar";
import avatarPlaceholder from "@/assests/user-icon.jpg";

import { UserData } from "@/lib/types";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

export default function Stories({ user }: { user: UserData | undefined }) {
  return (
    <div className="w-full px-2 sm:px-0">
      <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto">
        <div className="aspect-[9/16] h-52">
          <div className="size-full rounded-2xl">
            <Image
              src={user?.image || avatarPlaceholder}
              width={200}
              height={200}
              alt={`${user?.displayName}'s Profile`}
              className="h-4/6 rounded-t-2xl object-cover"
            />
            <div className="flex h-2/6 flex-col items-center justify-center gap-1 rounded-b-2xl bg-card">
              <PlusIcon />
              <span className="text-sm">Create a Story</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//  <div className="aspect-[9/16] h-52">
// <div className="size-full rounded-2xl bg-background"></div>
// </div>
