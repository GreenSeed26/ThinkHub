import kyInstance from "@/lib/ky";
import { FollowInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
