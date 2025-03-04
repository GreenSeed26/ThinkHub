import type { AppFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers, generateUploadButton } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<AppFileRouter>();

export const UploadButton = generateUploadButton<AppFileRouter>();
