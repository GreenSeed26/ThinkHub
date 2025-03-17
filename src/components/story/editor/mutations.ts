import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory } from "./actions";

export default function useSubmitStoryMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories-feed"] });

      toast({
        description: "Story created!",
      });
    },

    // Handle Errors
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create story",
      });
    },
  });

  return mutation;
}
