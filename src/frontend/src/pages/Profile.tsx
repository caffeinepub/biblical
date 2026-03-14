import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { StoryCard } from "../components/StoryCard";
import { useGetDisplayName, useGetStoriesByAuthor } from "../hooks/useQueries";

export function Profile() {
  const { principal: principalStr } = useParams({
    from: "/profile/$principal",
  });

  let principal: Principal | null = null;
  try {
    principal = Principal.fromText(principalStr);
  } catch {
    // invalid principal
  }

  const { data: displayName, isLoading: nameLoading } =
    useGetDisplayName(principal);
  const { data: stories, isLoading: storiesLoading } =
    useGetStoriesByAuthor(principal);

  const isLoading = nameLoading || storiesLoading;
  const authorLabel = displayName || "Anonymous";

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
        data-ocid="profile.back.link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      {isLoading ? (
        <div className="space-y-4" data-ocid="profile.loading_state">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-6 space-y-3"
              >
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              {authorLabel}
            </h1>
            <p className="text-muted-foreground text-sm">
              {stories?.length ?? 0}{" "}
              {stories?.length === 1 ? "testimony" : "testimonies"} shared
            </p>
          </motion.div>

          {stories && stories.length === 0 ? (
            <div
              className="text-center py-16 space-y-3"
              data-ocid="profile.stories.empty_state"
            >
              <BookOpen
                className="w-12 h-12 text-muted-foreground/40 mx-auto"
                strokeWidth={1}
              />
              <p className="text-muted-foreground">No stories shared yet.</p>
            </div>
          ) : (
            <div className="space-y-4" data-ocid="profile.stories.list">
              {stories?.map((story, i) => (
                <StoryCard
                  key={story.id.toString()}
                  story={story}
                  index={i}
                  data-ocid={`profile.stories.item.${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
