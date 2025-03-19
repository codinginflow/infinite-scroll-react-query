import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";
import {
  CreateCommentResponse,
  GetCommentsResponse,
} from "../api/comments/route";

const queryKey: QueryKey = ["comments"];

export function useComments() {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      ky
        .get(`/api/comments?${pageParam ? `cursor=${pageParam}` : ""}`)
        .json<GetCommentsResponse>(),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: { text: string }) =>
      ky
        .post("/api/comments", { json: newComment })
        .json<CreateCommentResponse>(),
    onSuccess: async ({ comment }) => {
      // Cancel any outgoing refetches to avoid them overwriting our update
      await queryClient.cancelQueries({ queryKey });

      // Update the query cache with the new comment so we don't have to wait for the refetch
      queryClient.setQueryData<
        InfiniteData<GetCommentsResponse, number | undefined>
      >(queryKey, (oldData) => {
        // Add the new comment to the first page of results. This depends on your ordering.
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                comments: [comment, ...firstPage.comments],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      // You can still invalidate the query afterwards but it's not really necessary
      // queryClient.invalidateQueries({ queryKey });
    },
  });
}
