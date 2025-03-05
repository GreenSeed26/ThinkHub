import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createComment } from "./actions";
import { CommentsPage } from "@/lib/types";

export function useCreateCommentMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  nextCursor: firstPage.nextCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Comment created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}
