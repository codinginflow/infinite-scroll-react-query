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
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<
        InfiniteData<GetCommentsResponse, number | undefined>
      >(queryKey, (oldData) => {
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

      // queryClient.invalidateQueries({ queryKey });
    },
  });
}
