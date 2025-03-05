import { useToast } from "@/hooks/use-toast";
import { UpdateProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateProfile } from "./action";
import { PostPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: avatarUpload } = useUploadThing("image");

  const { startUpload: bannerUpload } = useUploadThing("banner");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      image,
      banner,
    }: {
      values: UpdateProfileValues;
      image?: File;
      banner?: File;
    }) => {
      return Promise.all([
        updateProfile(values),
        image && avatarUpload([image]),
        banner && bannerUpload([banner]),
      ]);
    },
    onSuccess: async ([updatedUser, avatarResult]) => {
      const newAvatarUrl = avatarResult?.[0].ufsUrl;

      const queryFilter = {
        queryKey: ["post-feed", "group-feed"],
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      image: newAvatarUrl || updatedUser.image,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );
      router.refresh();

      toast({
        description: "Profile updated successfully",
      });
    },

    onError(error) {
      console.error(error);
      toast({
        description: "An error Occured",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
