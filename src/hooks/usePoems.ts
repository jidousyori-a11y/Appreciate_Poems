import { useMemo } from "react";
import poemsData from "../generated/poems.json";
import type { Poem } from "../types";
import { DEFAULT_TAGS } from "../data/defaultTags";

export function usePoems() {
  const poems = poemsData as Poem[];
  const allTags = useMemo(() => {
    const set = new Set(DEFAULT_TAGS);
    for (const p of poems) {
      for (const t of p.tags) set.add(t);
    }
    return Array.from(set);
  }, [poems]);

  const allAuthors = useMemo(() => {
    const set = new Set<string>();
    for (const p of poems) {
      if (p.author) set.add(p.author);
    }
    return Array.from(set).sort();
  }, [poems]);

  return { poems, allTags, allAuthors };
}
