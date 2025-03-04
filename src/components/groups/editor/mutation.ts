import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createGroupPost } from "./actions";
import { PostPage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useGroupPostSubmit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createGroupPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["group-feed"],
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData?.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Post created",
      });
    },
  });

  return mutation;
}
