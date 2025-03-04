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
import { UserData } from "@/lib/types";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import avatarPlaceholder from "@/assests/user-icon.jpg";
import bannerPlaceholder from "@/assests/cover_photo.png";
import { useUpdateProfileMutation } from "./mutations";
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

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  onOpenChange,
  open,
  user,
}: EditProfileDialogProps) {
  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: user.bio || "",
      displayName: user.displayName || "",
    },
  });

  const mutation = useUpdateProfileMutation();
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [croppedBanner, setCroppedBanner] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateProfileValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.jpeg`)
      : undefined;
    const newBannerFile = croppedBanner
      ? new File([croppedBanner], `banner_${user.id}.jpeg`)
      : undefined;

    mutation.mutate(
      {
        values,
        image: newAvatarFile,
        banner: newBannerFile,
      },
      {
        onSuccess: async () => {
          setCroppedAvatar(null);
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
          <Label>User Banner</Label>
          <BannerInput
            src={
              croppedBanner
                ? URL.createObjectURL(croppedBanner)
                : user.banner || bannerPlaceholder
            }
            onImageCropped={setCroppedBanner}
          />
          <Label>User Image</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.image || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
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

function AvatarInput({ onImageCropped, src }: AvatarInputProps) {
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
          width={150}
          height={150}
          className="size-32 w-full flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black text-white opacity-30 transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropperDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
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

function BannerInput({ onImageCropped, src }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1920,
      1080,
      "JPEG",
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
