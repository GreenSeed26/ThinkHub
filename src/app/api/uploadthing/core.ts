import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  image: f({
    image: {
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.image;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.ufsUrl;

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          image: newAvatarUrl,
        },
      });

      return { image: newAvatarUrl };
    }),
  banner: f({
    image: {
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldBannerUrl = metadata.user.banner;

      if (oldBannerUrl) {
        const key = oldBannerUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newBannerUrl = file.ufsUrl;

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          banner: newBannerUrl,
        },
      });
    }),
  groupImage: f({
    image: {
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      const group = await prisma.group.findFirst({
        where: {
          members: {
            some: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
        select: {
          id: true,
          image: true,
        },
      });

      if (!group) return {};

      return { group };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (!metadata.group) return;
      const oldGroupImageUrl = metadata.group.image;

      if (oldGroupImageUrl) {
        const key = oldGroupImageUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newGroupImageUrl = file.ufsUrl;

      await prisma.group.update({
        where: {
          id: metadata.group.id,
        },
        data: {
          image: newGroupImageUrl,
        },
      });
    }),
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.ufsUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
  story: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.storyMedia.create({
        data: {
          mediaUrl: file.ufsUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
