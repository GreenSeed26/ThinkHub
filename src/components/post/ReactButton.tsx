"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { ThumbsUp } from "lucide-react";
import { $Enums } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

interface ReactButtonProps {
  postId: string;
  initialState: LikeInfo;
}

const reactions: { emoji: string; type: $Enums.ReactionType }[] = [
  { emoji: "👍", type: $Enums.ReactionType.LIKE },
  { emoji: "❤️", type: $Enums.ReactionType.HAHA },
  { emoji: "😂", type: $Enums.ReactionType.WOW },
  { emoji: "😢", type: $Enums.ReactionType.SAD },
  { emoji: "😡", type: $Enums.ReactionType.ANGRY },
];

export default function ReactButton({
  postId,
  initialState,
}: ReactButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = ["like-info", postId];

  const { data } = useQuery({
    queryFn: () => kyInstance.get(`/api/post/${postId}/likes`).json<LikeInfo>(),
    queryKey,
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: ({ reaction }: { reaction: $Enums.ReactionType | null }) =>
      data.isLikedByUser && data.reaction === reaction
        ? kyInstance.delete(`/api/post/${postId}/likes`)
        : kyInstance.post(`/api/post/${postId}/likes`, { json: { reaction } }),

    onMutate: async ({ reaction }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);
      if (!previousState) return;

      const isRemovingReaction =
        previousState.isLikedByUser && previousState.reaction === reaction;
      const isUpdatingReaction =
        previousState.isLikedByUser && previousState.reaction !== reaction;

      const newState: LikeInfo = {
        likes:
          previousState.likes +
          (isRemovingReaction ? -1 : isUpdatingReaction ? 0 : 1),
        isLikedByUser: previousState.reaction === reaction ? false : true,
        reaction: previousState.reaction === reaction ? null : reaction,
        reactions: {
          ...previousState.reactions,
          ...(reaction
            ? { [reaction]: (previousState.reactions?.[reaction] || 0) + 1 }
            : {}),
          ...(previousState.reaction
            ? {
                [previousState.reaction]: Math.max(
                  0,
                  (previousState.reactions?.[previousState.reaction] || 0) - 1,
                ),
              }
            : {}),
        },
      };

      queryClient.setQueryData<LikeInfo>(queryKey, newState);

      return { previousState };
    },

    onError(error, variables, context) {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsClicked(false);
      }
    }

    if (isClicked) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isClicked]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center gap-2"
        onClick={() =>
          data.isLikedByUser
            ? mutate({ reaction: data.reaction })
            : setIsClicked((curr) => !curr)
        }
      >
        {data.isLikedByUser ? (
          reactions.find((r) => r.type === data.reaction)?.emoji
        ) : (
          <ThumbsUp className="size-6" />
        )}
        <span className="text-sm font-medium tabular-nums">{data.likes}</span>
      </button>

      <div
        ref={menuRef}
        className={cn(
          "absolute left-0 rounded-2xl border bg-card transition-all",
          isClicked
            ? "pointer-events-auto -top-[115%] opacity-100"
            : "pointer-events-none top-0 opacity-0",
        )}
      >
        <div className="flex justify-around text-3xl">
          {reactions.map(({ emoji, type }) => (
            <button
              key={type}
              onClick={() => {
                mutate({ reaction: type });
                setIsClicked(false);
              }}
              className="transition-transform hover:-translate-y-[20%]"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
