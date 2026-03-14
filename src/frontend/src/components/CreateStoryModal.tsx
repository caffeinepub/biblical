import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateStory,
  useGetDisplayName,
  useSetDisplayName,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Freelancer",
  "Teacher",
  "Farmer",
  "Driver",
  "Nurse",
  "Trader",
  "Artist",
  "Developer",
  "Chef",
  "Other",
];

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoryModal({
  open,
  onOpenChange,
}: CreateStoryModalProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal() ?? null;

  const { data: existingDisplayName } = useGetDisplayName(principal);
  const createStory = useCreateStory();
  const setDisplayName = useSetDisplayName();

  const [displayName, setDisplayNameState] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [workCategory, setWorkCategory] = useState("");
  const [earningsAmount, setEarningsAmount] = useState("");

  const needsDisplayName = isLoggedIn && !existingDisplayName;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      login();
      return;
    }

    try {
      if (needsDisplayName && displayName.trim()) {
        await setDisplayName.mutateAsync(displayName.trim());
      }
      await createStory.mutateAsync({
        title,
        body,
        workCategory,
        earningsAmount,
      });
      toast.success("Your story has been shared!");
      onOpenChange(false);
      setTitle("");
      setBody("");
      setWorkCategory("");
      setEarningsAmount("");
      setDisplayNameState("");
    } catch {
      toast.error("Failed to share your story. Please try again.");
    }
  }

  const isPending = createStory.isPending || setDisplayName.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-ocid="story.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Share Your Story
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            How did you earn today? Tell the community.
          </p>
        </DialogHeader>

        {!isLoggedIn ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-muted-foreground">
              Sign in to share your daily work story.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="story.login.button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Connecting...
                </>
              ) : (
                "Sign In to Continue"
              )}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {needsDisplayName && (
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Your Name</Label>
                <Input
                  id="displayName"
                  placeholder="e.g. Amara Johnson"
                  value={displayName}
                  onChange={(e) => setDisplayNameState(e.target.value)}
                  required
                  data-ocid="story.displayname.input"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="e.g. Drove 12 hours to feed my family tonight"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                data-ocid="story.title.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body">Your Story</Label>
              <Textarea
                id="body"
                placeholder="Share the details of your day. What did you do? What challenges did you face? What are you grateful for?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={5}
                className="resize-none"
                data-ocid="story.body.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Work Type</Label>
                <Select
                  value={workCategory}
                  onValueChange={setWorkCategory}
                  required
                >
                  <SelectTrigger data-ocid="story.category.select">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="earnings">Earnings Today</Label>
                <Input
                  id="earnings"
                  placeholder="e.g. $50, ₦3,000"
                  value={earningsAmount}
                  onChange={(e) => setEarningsAmount(e.target.value)}
                  data-ocid="story.earnings.input"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-ocid="story.cancel.button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !workCategory}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                data-ocid="story.submit.button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sharing...
                  </>
                ) : (
                  "Share Story"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
