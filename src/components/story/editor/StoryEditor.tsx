"use client";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import React, { useRef } from "react";
import { Attachment, useStoryMediaUpload } from "./useStoryMediaUpload";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LoadingButton from "@/components/LoadingButton";
import { Progress } from "@/components/ui/progress";
import useSubmitStoryMutation from "./mutations";
import { useRouter } from "next/navigation";

export default function StoryEditor() {
  const router = useRouter();
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
    <div>
      <AddAttachmentsButton
        onFilesSelected={startUpload}
        disabled={isUploading}
      />
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      {isUploading && (
        <>
          <span className="text-sm">{uploadProgress ?? 0}%</span>
          <Progress value={uploadProgress ?? 0} />
        </>
      )}
      <LoadingButton
        onClick={onSubmit}
        loading={mutation.isPending}
        disabled={isUploading}
        className="min-w-20"
      >
        Post
      </LoadingButton>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="aspect-[9/16] w-96 rounded-2xl object-cover"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
