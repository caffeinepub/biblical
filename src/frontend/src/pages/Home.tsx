import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { BookOpen, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CreateStoryModal } from "../components/CreateStoryModal";
import { StoryCard } from "../components/StoryCard";
import { useGetStories } from "../hooks/useQueries";
import type { Story } from "../hooks/useQueries";

function makePrincipal(id: string): Principal {
  return { toString: () => id } as unknown as Principal;
}

const SAMPLE_STORIES: Story[] = [
  {
    id: BigInt(1),
    title: "Taught 40 children the alphabet today",
    body: "It was a Monday like any other at the community school. But when little Emeka spelled his name for the first time, I remembered why I chose this path. Teaching pays little but the joy is immeasurable. I brought home ₦4,500 after transport.",
    workCategory: "Teacher",
    earningsAmount: "₦4,500",
    authorName: "Grace Okonkwo",
    authorPrincipal: makePrincipal("sample-1"),
    createdAt: BigInt(Date.now() - 3600000) * BigInt(1_000_000),
    likes: BigInt(24),
  },
  {
    id: BigInt(2),
    title: "Harvested cassava before sunrise, sold out by noon",
    body: "Woke at 4am to beat the heat. My wife and I worked the field together — three rows of cassava ready. By 11:30am at the market, every tuber was sold. A good day. Paid the school fees we owed. God is faithful.",
    workCategory: "Farmer",
    earningsAmount: "$31",
    authorName: "Daniel Asante",
    authorPrincipal: makePrincipal("sample-2"),
    createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    likes: BigInt(41),
  },
  {
    id: BigInt(3),
    title: "Six rides, one flat tire, still made rent",
    body: "Started rideshare at 5am. Third ride I got a flat. Lost two hours and ₦1,200 fixing it. But I pushed through to midnight. Total: ₦12,400. Rent is ₦12,000. I slept well. Barely — but well.",
    workCategory: "Driver",
    earningsAmount: "₦12,400",
    authorName: "Chukwuemeka Eze",
    authorPrincipal: makePrincipal("sample-3"),
    createdAt: BigInt(Date.now() - 172800000) * BigInt(1_000_000),
    likes: BigInt(67),
  },
  {
    id: BigInt(4),
    title: "Delivered 3 freelance logos today — a record for me",
    body: "Pulled an all-nighter to finish a logo for a Lagos startup. Then two more came in from referrals. Delivered all three before 6pm. Clients loved them. Deposited $180 into savings. This freelancing journey is real.",
    workCategory: "Freelancer",
    earningsAmount: "$180",
    authorName: "Miriam Adeyemi",
    authorPrincipal: makePrincipal("sample-4"),
    createdAt: BigInt(Date.now() - 259200000) * BigInt(1_000_000),
    likes: BigInt(52),
  },
  {
    id: BigInt(5),
    title: "Night shift at the clinic — saved a life, earned $45",
    body: "A mother came in at 2am with her baby in respiratory distress. We stabilized him. By morning he was breathing fine. I earned $45 for the shift. I would have done it for nothing — but the $45 feeds my kids.",
    workCategory: "Nurse",
    earningsAmount: "$45",
    authorName: "Florence Mensah",
    authorPrincipal: makePrincipal("sample-5"),
    createdAt: BigInt(Date.now() - 345600000) * BigInt(1_000_000),
    likes: BigInt(89),
  },
];

export function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: stories, isLoading, isError } = useGetStories();

  const displayStories =
    stories && stories.length > 0 ? stories : SAMPLE_STORIES;

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('/assets/generated/biblical-hero-bg.dim_1600x600.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative container max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent" strokeWidth={1.5} />
              <span className="text-accent text-sm font-medium tracking-wide uppercase">
                Daily Testimonies
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
              Every day is a{" "}
              <span className="italic text-accent">testimony</span>.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Biblical is a community where real people share how they earn a
              living every day. From farms to classrooms, markets to midnight
              shifts — your work story matters.
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base"
              data-ocid="home.share.primary_button"
            >
              <PenLine className="w-4 h-4" />
              Share Your Story
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feed */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Today&apos;s Stories
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-2"
            data-ocid="home.share.secondary_button"
          >
            <PenLine className="w-3.5 h-3.5" />
            Write Yours
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-4" data-ocid="home.stories.loading_state">
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
        )}

        {isError && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="home.stories.error_state"
          >
            <p>Could not load stories. Please refresh.</p>
          </div>
        )}

        {!isLoading && !isError && displayStories.length === 0 && (
          <div
            className="text-center py-16 space-y-4"
            data-ocid="home.stories.empty_state"
          >
            <BookOpen
              className="w-12 h-12 text-muted-foreground/40 mx-auto"
              strokeWidth={1}
            />
            <p className="text-muted-foreground">
              No stories yet. Be the first to share!
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="home.empty.primary_button"
            >
              Share Your Story
            </Button>
          </div>
        )}

        {!isLoading && !isError && displayStories.length > 0 && (
          <div className="space-y-4" data-ocid="home.stories.list">
            {displayStories.map((story, i) => (
              <StoryCard
                key={story.id.toString()}
                story={story}
                index={i}
                data-ocid={`home.stories.item.${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <CreateStoryModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
