"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserData } from "@/lib/types";
import { convertToLocaleString, delay } from "@/lib/utils";
import { LucideClock } from "lucide-react";
import { SetStateAction, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "./action";
import LoadingButton from "@/components/LoadingButton";

interface InfoSidebarProps {
  className?: string;
  user: UserData;
  loggedInUserId: string;
}

export default function InfoSidebar({
  className,
  user,
  loggedInUserId,
}: InfoSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className={className}>
      <h1 className="text-center text-lg">Intro</h1>

      <div className="w-full space-y-3">
        {isEditing ? (
          <BioEditor setIsEditing={setIsEditing} user={user} />
        ) : (
          <>
            {user.bio && <p className="text-center">{user.bio}</p>}
            {loggedInUserId === user.id && (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-muted text-secondary-foreground hover:bg-secondary-foreground/30"
              >
                {user.bio ? "Edit Bio" : "Add Bio"}
              </Button>
            )}
          </>
        )}
        {loggedInUserId !== user.id && <Separator />}
      </div>

      <div className="flex gap-3">
        <LucideClock /> Joined {convertToLocaleString(user.createdAt)}
      </div>
    </div>
  );
}

function BioEditor({
  user,
  setIsEditing,
}: {
  user: UserData;
  setIsEditing: (value: SetStateAction<boolean>) => void;
}) {
  const [txt, setTxt] = useState(user.bio || "");
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    const previousBio = user.bio;
    user.bio = txt;
    setIsEditing(false);
    startTransition(async () => {
      try {
        await updateProfile({ bio: txt, displayName: user.displayName || "" });
      } catch (error) {
        user.bio = previousBio;
        setIsEditing(true);
        console.error("Failed to update bio", error);
      }
    });
  }
  return (
    <div>
      <Textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        placeholder="Describe yourself"
        maxLength={101}
        className="w-full resize-none overflow-y-auto rounded-2xl bg-background px-5 py-3 text-center"
      />
      <span className="place-self-end text-sm text-muted-foreground">
        {txt.length}/101 remaining
      </span>
      <div className="flex justify-end gap-2 p-2">
        <Button
          onClick={() => setIsEditing(false)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary-foreground/30"
        >
          Cancel
        </Button>
        <LoadingButton loading={isPending} onClick={onSubmit}>
          Save
        </LoadingButton>
      </div>
    </div>
  );
}
