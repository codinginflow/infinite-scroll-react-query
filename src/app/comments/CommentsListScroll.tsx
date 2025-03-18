"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { Loader2 } from "lucide-react";
import { Comment } from "./Comment";
import { useComments } from "./use-comments-hooks";

export default function CommentsListScroll() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useComments();

  const comments = data?.pages.flatMap((page) => page.comments);

  if (isPending) {
    return <Loader2 className="animate-spin mx-auto" />;
  }

  return (
    <div className="space-y-4 mb-10">
      {comments && comments.length > 0 && (
        <InfiniteScrollContainer
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
          className="space-y-3"
        >
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
          {isFetchingNextPage && (
            <div className="flex justify-center my-4">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </InfiniteScrollContainer>
      )}
      {!isError && !comments?.length && (
        <div className="text-center">No comments yet.</div>
      )}
      {isError && (
        <div className="text-center text-red-500">
          Error loading comments: {error.message}
        </div>
      )}
    </div>
  );
}
