import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center space-y-6 text-balance">
        <h1 className="text-3xl font-bold">Infinite Scroll with React Query</h1>
        <p className="text-lg text-muted-foreground">
          A tutorial project demonstrating infinite scrolling using React
          Query&apos;s useInfiniteQuery hook. Learn how to implement pagination,
          mutations, and cache updates by building a comment system.
        </p>
        <p>
          Watch the full tutorial on the{" "}
          <a
            href="https://www.youtube.com/c/codinginflow?sub_confirmation=1"
            target="_blank"
            className="text-[#4daa57] hover:underline"
          >
            Coding in Flow
          </a>{" "}
          YouTube channel.
        </p>
        <Button asChild size="lg">
          <Link href="/comments">View Comments Demo</Link>
        </Button>
      </main>
    </div>
  );
}
