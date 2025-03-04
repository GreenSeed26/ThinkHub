import { useToast } from "@/hooks/use-toast";
import { UpdateGroupProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateGroupProfile } from "./actions";
import { PostPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export function useUpdateGroupProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: groupImageUpload } = useUploadThing("groupImage");

  const mutation = useMutation({
    mutationFn: async ({
      groupId,
      values,
      groupImage,
    }: {
      values: UpdateGroupProfileValues;
      groupImage?: File;
      groupId: string;
    }) => {
      return Promise.all([
        updateGroupProfile({ input: values, groupId }),
        groupImage && groupImageUpload([groupImage]),
      ]);
    },
    onSuccess: async ([updatedGroup, groupImageResult]) => {
      const newGroupImageUrl = groupImageResult?.[0].appUrl;

      const queryFilter = {
        queryKey: ["group-feed"],
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
                if (post.groupId === updatedGroup.id) {
                  return {
                    ...post,
                    group: {
                      ...updatedGroup,
                      image: newGroupImageUrl || updatedGroup.image,
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
