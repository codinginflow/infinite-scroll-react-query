import { User } from "@/lib/auth";
import { formatRelativeDate } from "@/lib/utils";

interface CommentProps {
  comment: {
    id: number;
    text: string;
    createdAt: string;
    user: User;
  };
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex gap-3 p-3 border rounded-lg bg-card">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {comment.user.avatar}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium">{comment.user.name}</p>
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-muted-foreground mt-1">{comment.text}</p>
      </div>
    </div>
  );
}
