"use client";
import { PostData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import { cn, relativeDateFormat } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import LikeButton from "./LikeButton";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import Link from "next/link";
import GroupAvatar from "../groups/GroupAvatar";
import Image from "next/image";
import { Media } from "@prisma/client";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { data } = useSession();

  return (
    <article className="w-full space-y-3 border bg-card p-5 shadow-sm sm:rounded-2xl">
      <div className="flex justify-between gap-3">
        <div className="flew-wrap flex gap-3">
          {post.group ? (
            <div className="relative h-fit">
              <GroupAvatar
                size={200}
                avatarUrl={post.group.image}
                className="size-12 rounded"
              />
              <UserAvatar
                avatarUrl={post.user.image}
                size={30}
                className="absolute -bottom-2 -right-2 ring-2 ring-card"
              />
            </div>
          ) : (
            <UserAvatar avatarUrl={post.user.image} />
          )}
          <div>
            <div className="flex items-center">
              {post.group ? (
                <div className="flex flex-col">
                  <Link
                    className="flex items-center gap-2 font-semibold hover:underline"
                    href={`/group/${post.group.id}`}
                  >
                    <p className="line-clamp-1">{post.group.name}</p>
                  </Link>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground">
                      {post.user.displayName}
                    </p>
                    <div className="text-muted-foreground">&bull;</div>
                    <span className="text-sm text-muted-foreground">
                      {relativeDateFormat(post.createdAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <Link
                    href={`/user/${post.user.displayName}`}
                    className="block font-medium hover:underline"
                  >
                    {post.user.displayName}
                  </Link>

                  <Link
                    href={`/posts/${post.id}`}
                    className="block text-sm text-muted-foreground hover:underline"
                    suppressHydrationWarning
                  >
                    {relativeDateFormat(post.createdAt)}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="whitespace-pre-wrap">{post.content}</div>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <Separator />
      <div className="flex justify-around">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some(
              (like) => like.userId === data?.user.id,
            ),
          }}
        />
        <MessageCircle />
        <BookmarkButton
          initialState={{
            isBookmarkedByUser: post.bookmark.some(
              (bookmark) => bookmark.userId === data?.user.id,
            ),
          }}
          postId={post.id}
        />
      </div>
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
