import kyInstance from "@/lib/ky";
import { JoinInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useGroupInfo(groupId: string, initialState: JoinInfo) {
  const query = useQuery({
    queryKey: ["join-info", groupId],
    queryFn: () =>
      kyInstance.get(`/api/group/${groupId}/join`).json<JoinInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
