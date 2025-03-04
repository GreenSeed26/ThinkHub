"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import "./style.css";
import LoadingButton from "@/components/LoadingButton";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "next-auth/react";
import { UserData } from "@/lib/types";
import { UploadButton } from "@/lib/uploadthing";
import { useGroupPostSubmit } from "./mutation";

export default function Editor({ groupId }: { groupId: string }) {
  const { data } = useSession();

  const user = data?.user;
  const mutation = useGroupPostSubmit();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write a Post",
      }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";
  function onSubmit() {
    mutation.mutate(
      {
        input: { content: input },
        groupId,
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
        },
      },
    );
  }
  return (
    <div className="flex w-full flex-col gap-5 bg-card p-5 shadow-sm sm:rounded-2xl">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user?.image} />
        <EditorContent
          editor={editor}
          className={cn(
            "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
          )}
        />
      </div>
      <LoadingButton
        onClick={onSubmit}
        loading={mutation.isPending}
        disabled={!input.trim()}
        className="min-w-20"
      >
        Post
      </LoadingButton>
    </div>
  );
}
