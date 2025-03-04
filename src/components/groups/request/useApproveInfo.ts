import kyInstance from "@/lib/ky";
import { ApprovalInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useApproveInfo(
  groupId: string,
  initialState: ApprovalInfo,
) {
  const query = useQuery({
    queryKey: ["join-approval", groupId],
    queryFn: () =>
      kyInstance.get(`api/group/${groupId}/approval`).json<ApprovalInfo>(),
    staleTime: Infinity,
    initialData: initialState,
  });

  return query;
}
