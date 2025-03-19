"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Textbox } from "fabric";
import { v4 as uuidV4 } from "uuid";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Save,
  Send,
  SendHorizontal,
  Square,
  TypeIcon,
  X,
} from "lucide-react";
import ImageButton from "./ImageButton";
import { Attachment, useStoryMediaUpload } from "../useStoryMediaUpload";
import { cn } from "@/lib/utils";
import useSubmitStoryMutation from "../mutations";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";

function createFileList(file: File): FileList {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
}

export default function FabricJS() {
  const mutation = useSubmitStoryMutation();
  const {
    attachments,
    isUploading,
    removeAttachment,
    reset,
    startUpload,
    uploadProgress,
    url,
  } = useStoryMediaUpload();

  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 432,
        height: 768,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (!canvas) return;

    const rect = new Rect({
      top: 100,
      left: 50,
      height: 100,
      width: 60,
      fill: "#008000",
    });

    canvas.add(rect);
  };

  const addText = () => {
    if (!canvas) return;

    const text = new Textbox("Hello", {
      top: 100,
      left: 100,
    });

    canvas.add(text);
  };

  const getImageCanvas = () => {
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();

    console.log(canvas.getObjects().find((obj) => obj.get("id")));

    if (attachments.length > 0) {
      attachments.map((a) => removeAttachment(a.file.name));
    }

    canvasRef.current?.toBlob((b) => {
      const storyFile = b
        ? new File([b], `story_${uuidV4()}.webp`, {
            type: b.type,
          })
        : undefined;
      const story = storyFile ? createFileList(storyFile) : undefined;

      startUpload(Array.from(story || []));
    });
  };
  const onSubmit = () => {
    mutation.mutate(
      {
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
        fileType: "IMAGE",
        fileUrl: url || "",
      },
      {
        onSuccess: () => {
          router.push("/");
          reset();
        },
      },
    );
  };

  return (
    <main className="relative w-full overflow-hidden">
      <div className="absolute bottom-0 z-40 flex flex-col items-center gap-2 p-2 shadow-sm sm:hidden">
        <Button onClick={addRectangle} variant="secondary">
          <Square />
        </Button>
        <Button onClick={addText} variant="secondary">
          <TypeIcon />
        </Button>
        <ImageButton canvas={canvas} />
        <Button disabled={isUploading} onClick={getImageCanvas}>
          {isUploading ? <Loader2 className="animate-spin" /> : <Save />}
        </Button>
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={attachments.length === 0 || isUploading}
          className="mt-2 w-full"
        >
          {!mutation.isPending && <Send />}
        </LoadingButton>
      </div>
      <div className="absolute bottom-0 top-0 flex w-full">
        <div className="hidden h-full max-w-96 grow space-y-3 rounded-2xl bg-card p-2 sm:block">
          <h1>Edit Story</h1>

          <div className="flex w-full flex-col items-center justify-around gap-2 md:flex-row">
            <Button
              className="w-fit"
              onClick={addRectangle}
              variant="secondary"
            >
              <Square />
            </Button>
            <Button className="w-fit" onClick={addText} variant="secondary">
              <TypeIcon />
            </Button>
            <ImageButton className="w-fit" canvas={canvas} />
          </div>
          <div className="flex justify-center gap-2">
            <Button className="" onClick={getImageCanvas}>
              <Save />
              <span className="hidden md:inline-block">Show Preview</span>
            </Button>
            <LoadingButton
              onClick={onSubmit}
              loading={mutation.isPending}
              disabled={attachments.length === 0 || isUploading}
              className="w-fit"
            >
              <SendHorizontal />
              <span className="hidden md:inline-block">Post</span>
            </LoadingButton>
          </div>
          <div className="relative">
            {isUploading && (
              <div className="absolute z-30 flex h-full w-full items-center justify-center gap-3 p-3">
                <span className="text-sm">{uploadProgress ?? 0}%</span>
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            )}
            {!!attachments.length && (
              <AttachmentPreviews
                attachments={attachments}
                removeAttachment={removeAttachment}
              />
            )}
          </div>
        </div>
        <div className="flex flex-grow items-center justify-center">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </main>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (filename: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        attachments.length > 1 && "grid grid-cols-2",
      )}
    >
      {attachments.map((attachment, index) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          index={index}
          attachmentLength={attachments.length}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
  index?: number;
  attachmentLength?: number;
}

function AttachmentPreview({
  attachment: { file, isUploading },
  onRemoveClick,
  index,
  attachmentLength,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn(
        "relative mx-auto h-full w-64",
        index === 1 && attachmentLength === 3 && "row-span-2",
      )}
    >
      {file.type.startsWith("image") ? (
        <NextImage
          src={src}
          alt="preview"
          width={500}
          height={500}
          className={cn(
            "aspect-[9/16] rounded-xl object-cover",
            isUploading && "opacity-50",
          )}
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-background/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
