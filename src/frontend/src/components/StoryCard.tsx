import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import type { Story } from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  Freelancer: "bg-blue-100 text-blue-800",
  Teacher: "bg-green-100 text-green-800",
  Farmer: "bg-lime-100 text-lime-800",
  Driver: "bg-orange-100 text-orange-800",
  Nurse: "bg-pink-100 text-pink-800",
  Trader: "bg-yellow-100 text-yellow-800",
  Artist: "bg-purple-100 text-purple-800",
  Developer: "bg-cyan-100 text-cyan-800",
  Chef: "bg-red-100 text-red-800",
  Other: "bg-gray-100 text-gray-700",
};

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface StoryCardProps {
  story: Story;
  index?: number;
  "data-ocid"?: string;
}

export function StoryCard({
  story,
  index = 0,
  "data-ocid": ocid,
}: StoryCardProps) {
  const colorClass =
    CATEGORY_COLORS[story.workCategory] ?? CATEGORY_COLORS.Other;
  const excerpt =
    story.body.length > 180 ? `${story.body.slice(0, 180)}…` : story.body;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      className="story-card rounded-lg p-5 sm:p-6"
      data-ocid={ocid}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/profile/$principal"
            params={{ principal: story.authorPrincipal.toString() }}
            className="font-semibold text-foreground hover:text-accent transition-colors text-sm"
            data-ocid="story.author.link"
          >
            {story.authorName || "Anonymous"}
          </Link>
          <span className="text-muted-foreground text-xs">
            {timeAgo(story.createdAt)}
          </span>
        </div>
        <Badge
          className={`text-xs font-medium border-0 shrink-0 ${colorClass}`}
        >
          {story.workCategory}
        </Badge>
      </div>

      <Link
        to="/story/$id"
        params={{ id: story.id.toString() }}
        data-ocid="story.title.link"
      >
        <h2 className="font-display text-lg font-semibold text-foreground mb-2 leading-snug hover:text-accent transition-colors">
          {story.title}
        </h2>
      </Link>

      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
          <span className="text-xs text-muted-foreground">
            {story.likes.toString()} prayers
          </span>
        </div>
        {story.earningsAmount && (
          <span className="text-xs font-semibold bg-primary/15 text-foreground px-2.5 py-0.5 rounded-full">
            {story.earningsAmount}
          </span>
        )}
      </div>
    </motion.article>
  );
}
