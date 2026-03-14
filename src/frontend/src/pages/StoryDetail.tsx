import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, User } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetStory, useLikeStory } from "../hooks/useQueries";

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function StoryDetail() {
  const { id } = useParams({ from: "/story/$id" });
  const storyId = BigInt(id);
  const { data: story, isLoading, isError } = useGetStory(storyId);
  const likeStory = useLikeStory();
  const { identity, login } = useInternetIdentity();

  async function handleLike() {
    if (!identity) {
      login();
      return;
    }
    try {
      await likeStory.mutateAsync(storyId);
      toast.success("Prayed for this story!");
    } catch {
      toast.error("Could not save your prayer.");
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
        data-ocid="story.back.link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      {isLoading && (
        <div className="space-y-4" data-ocid="story.detail.loading_state">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && (
        <div className="text-center py-12" data-ocid="story.detail.error_state">
          <p className="text-muted-foreground">Could not load this story.</p>
        </div>
      )}

      {!isLoading && !isError && !story && (
        <div className="text-center py-12" data-ocid="story.detail.empty_state">
          <p className="text-muted-foreground">Story not found.</p>
          <Link to="/" className="text-accent underline mt-4 inline-block">
            Go back home
          </Link>
        </div>
      )}

      {story && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge className="border-0 bg-muted text-muted-foreground text-xs">
              {story.workCategory}
            </Badge>
            {story.earningsAmount && (
              <span className="text-xs font-semibold bg-primary/15 text-foreground px-2.5 py-0.5 rounded-full">
                {story.earningsAmount}
              </span>
            )}
            <span className="text-muted-foreground text-xs ml-auto">
              {timeAgo(story.createdAt)}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
            {story.title}
          </h1>

          <Link
            to="/profile/$principal"
            params={{ principal: story.authorPrincipal.toString() }}
            className="inline-flex items-center gap-2 mb-8 group"
            data-ocid="story.author.link"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-medium text-foreground group-hover:text-accent transition-colors">
              {story.authorName || "Anonymous"}
            </span>
          </Link>

          <div
            className="prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap mb-10 font-body text-base"
            data-ocid="story.body.section"
          >
            {story.body}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <Button
              onClick={handleLike}
              variant="outline"
              size="sm"
              disabled={likeStory.isPending}
              className="gap-2 hover:border-accent hover:text-accent transition-colors"
              data-ocid="story.like.button"
            >
              <Heart
                className="w-4 h-4"
                fill={likeStory.isSuccess ? "currentColor" : "none"}
              />
              {story.likes.toString()} Prayers
            </Button>

            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="story.feed.link"
            >
              See more stories
            </Link>
          </div>
        </motion.article>
      )}
    </div>
  );
}
