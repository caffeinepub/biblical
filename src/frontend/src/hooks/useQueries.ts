import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Story } from "../backend.d";
import { useActor } from "./useActor";

export type { Story };

export function useGetStories() {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getStories();
      return [...result].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStory(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Story | null>({
    queryKey: ["story", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStory(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStoriesByAuthor(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories", "author", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const result = await actor.getStoriesByAuthor(principal);
      return [...result].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useGetDisplayName(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ["displayName", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getDisplayName(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useCreateStory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      body: string;
      workCategory: string;
      earningsAmount: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createStory(
        args.title,
        args.body,
        args.workCategory,
        args.earningsAmount,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

export function useLikeStory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.likeStory(id);
    },
    onSuccess: (updated) => {
      if (updated) {
        qc.setQueryData<Story[]>(["stories"], (old) =>
          old ? old.map((s) => (s.id === updated.id ? updated : s)) : old,
        );
        qc.setQueryData<Story | null>(
          ["story", updated.id.toString()],
          updated,
        );
      }
    },
  });
}

export function useSetDisplayName() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.setDisplayName(name);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["displayName"] });
    },
  });
}
