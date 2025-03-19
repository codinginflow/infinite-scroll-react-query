import { getCurrentUser } from "@/lib/auth";
import { myOrm } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Comment } from "./data";

export type GetCommentsResponse = {
  comments: Comment[];
  nextCursor?: number;
};

export type CreateCommentResponse = {
  comment: Comment;
};

export async function GET(request: NextRequest) {
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? parseInt(cursorParam) : undefined;

  // You could also pass this as a nother searchParam from the frontend
  const pageSize = 10;

  // Simulate network delay (between 300ms and 1000ms)
  const delay = Math.floor(Math.random() * 700) + 300;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Remove comment to return an error
  //   return NextResponse.json(
  //     { error: "Failed to fetch comments" },
  //     { status: 500 }
  //   );

  // Below is identical to how I do pagination with Prisma ORM
  const comments = await myOrm.findComments({
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    sort: "desc",
  });

  const nextCursor =
    comments.length > pageSize ? comments[pageSize].id : undefined;

  const response: GetCommentsResponse = {
    comments: comments.slice(0, pageSize),
    nextCursor,
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Simulate network delay (between 300ms and 1000ms)
  const delay = Math.floor(Math.random() * 700) + 300;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // In a real app, this would come from your authentication service
  const currentUser = await getCurrentUser();

  const newComment = await myOrm.createComment({
    text,
    user: currentUser,
  });

  const response: CreateCommentResponse = {
    comment: newComment,
  };

  return NextResponse.json(response);
}
