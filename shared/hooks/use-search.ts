import { useState, useMemo } from "react";
import Fuse from "fuse.js";

interface Props<T extends Object> {
  data: T[];
  keys: Array<keyof T>;
}

const SCORE_THRESHOLD = 0.3;

export default function useSearch<T extends Object>({
  data,
  keys,
}: Props<T>): {
  searchQuery: string;
  search: (value: string) => void;
  results: T[];
} {
  const [searchQuery, setSearchValue] = useState("");

  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      keys: keys as string[],
    };

    return new Fuse(data, options);
  }, [data, keys]);

  const results = useMemo(() => {
    if (!searchQuery) return data;

    const searchResults = fuse.search(searchQuery);

    return searchResults
      .filter(
        fuseResult =>
          fuseResult.score && fuseResult.score < SCORE_THRESHOLD
      )
      .map(fuseResult => fuseResult.item);
  }, [fuse, searchQuery, data]);

  return {
    searchQuery,
    search: (value: string) => setSearchValue(value),
    results,
  };
}
