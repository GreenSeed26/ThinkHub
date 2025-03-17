"use client";
import UserAvatar from "@/components/UserAvatar";
import kyInstance from "@/lib/ky";
import { StoryData } from "@/lib/types";
import { relativeDateFormat } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Story({ storyId }: { storyId: string }) {
  const { data, status } = useQuery({
    queryKey: ["stories", storyId],
    queryFn: () => kyInstance.get(`/api/stories/${storyId}`).json<StoryData>(),
  });

  return (
    <main className="w-full overflow-hidden sm:relative">
      <div className="bottom-0 top-0 flex h-full w-full justify-center sm:absolute sm:h-auto">
        {status === "pending" && <StorySkeleton />}
        {status === "success" && <StoryImages story={data} />}
      </div>
    </main>
  );
}

function StoryImages({ story }: { story: StoryData }) {
  const [isPaused, setIsPaused] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  function resetInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    if (!isPaused) startAutoSlide();
  }

  function startAutoSlide() {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % story.media.length);
      setProgress(0);
    }, 4000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 100 / (4000 / 100) : 100));
    }, 100);
  }

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [story.media.length, 4000, isPaused]);

  function prevImage() {
    setSlideIndex((i) => {
      if (i === 0) return story.media.length - 1;
      return i - 1;
    });
    if (isPaused) setIsPaused(false);
    resetInterval();
  }
  function nextImage() {
    setSlideIndex((i) => {
      if (i === story.media.length - 1) return 0;
      return i + 1;
    });
    if (isPaused) setIsPaused(false);
    resetInterval();
  }

  return (
    <div className="aspect-[9/16] h-full">
      <div className="relative size-full shadow-md">
        <div className="absolute flex w-full flex-col gap-1 bg-gradient-to-b from-black/80 to-black/0 p-2">
          <div className="flex w-full gap-1 p-0.5">
            {story.media.map((m, i) => (
              <div key={m.id} className="h-[2px] w-full bg-white/20">
                {i === slideIndex && (
                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                    className="h-full bg-white transition-all"
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <UserAvatar avatarUrl={story.user.image} />
            <div className="flex h-fit items-center gap-2">
              <span>{story.user.displayName}</span>
              <span className="text-sm">
                {relativeDateFormat(story.media[slideIndex].createdAt)}
              </span>
            </div>
          </div>
        </div>
        <Image
          src={story.media[slideIndex].mediaUrl}
          width={900}
          height={900}
          alt="uh"
          className="size-full border object-cover"
        />
        <div className="absolute top-0 flex h-full w-full justify-between">
          <button className="h-full w-1/4" onClick={prevImage}></button>
          <button
            className="w-2/4"
            onClick={() => setIsPaused((curr) => !curr)}
          ></button>
          <button className="h-full w-1/4" onClick={nextImage}></button>
        </div>
      </div>
    </div>
  );
}

function StorySkeleton() {
  return (
    <div className="aspect-[9/16] h-full">
      <div className="relative size-full shadow-md">
        <div className="absolute flex w-full flex-col gap-1 bg-gradient-to-b from-black/80 to-black/0 p-2">
          <div className="flex gap-2">
            <div className="aspect-square size-12 animate-pulse rounded-full bg-muted-foreground"></div>
            <div className="flex h-fit items-center gap-2">
              <div className="w-24 animate-pulse bg-card"></div>
            </div>
          </div>
        </div>
        <div className="size-full animate-pulse bg-muted"></div>
      </div>
    </div>
  );
}
