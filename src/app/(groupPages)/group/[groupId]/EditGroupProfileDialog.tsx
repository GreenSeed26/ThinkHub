"use client";
import CropperDialog from "@/components/CropperDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { GroupData } from "@/lib/types";
import {
  updateGroupProfileSchema,
  UpdateGroupProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import avatarPlaceholder from "@/assests/user-icon.jpg";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateGroupProfileMutation } from "./mutation";

interface EditProfileDialogProps {
  group: GroupData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditGroupProfileDialog({
  onOpenChange,
  open,
  group,
}: EditProfileDialogProps) {
  const form = useForm<UpdateGroupProfileValues>({
    resolver: zodResolver(updateGroupProfileSchema),
    defaultValues: {
      description: group.description || "",
      name: group.name || "",
    },
  });

  const mutation = useUpdateGroupProfileMutation();
  const [croppedGroupImage, setCroppedGroupImage] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateGroupProfileValues) {
    const newImageFile = croppedGroupImage
      ? new File([croppedGroupImage], `avatar_${group.id}.jpeg`)
      : undefined;

    mutation.mutate(
      {
        values,
        groupId: group.id,
        groupImage: newImageFile,
      },
      {
        onSuccess: async () => {
          setCroppedGroupImage(null);
          onOpenChange(false);
        },
      },
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Group Image</Label>
          <GroupImageInput
            src={
              croppedGroupImage
                ? URL.createObjectURL(croppedGroupImage)
                : group.image || avatarPlaceholder
            }
            onImageCropped={setCroppedGroupImage}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input placeholder="Group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Group Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function GroupImageInput({ onImageCropped, src }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative mx-auto block"
      >
        <Image
          src={src}
          alt="Image preview"
          width={266}
          height={150}
          className="aspect-[16/9] h-36 w-full flex-none object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black text-white opacity-30 transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropperDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={16 / 9}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
