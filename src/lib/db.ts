import { Comment, comments } from "@/app/api/comments/data";
import { User } from "./auth";

type FindCommentsParams = {
  take: number;
  cursor?: { id: number };
  sort?: "asc" | "desc";
};

type CreateCommentParams = {
  text: string;
  user: User;
};

// This file mimics the internals of an ORM like Prisma or Drizzle. You don't need to understand the code in here.

export const myOrm = {
  async findComments({
    take,
    cursor,
    sort = "desc",
  }: FindCommentsParams): Promise<Comment[]> {
    const sortedComments = [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "desc" ? dateB - dateA : dateA - dateB;
    });

    const startIndex = cursor
      ? sortedComments.findIndex((comment) => comment.id === cursor.id)
      : 0;
    const endIndex = startIndex + take;

    return sortedComments.slice(startIndex, endIndex);
  },

  async createComment({ text, user }: CreateCommentParams): Promise<Comment> {
    const newComment: Comment = {
      id: Date.now(),
      user,
      text,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    return newComment;
  },
};
