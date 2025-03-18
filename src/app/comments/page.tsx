import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import CommentsListScroll from "./CommentsListScroll";

export default function Page() {
  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Comments</h2>
      <CommentForm />
      {/* <CommentsList /> */}
      <CommentsListScroll />
    </div>
  );
}
