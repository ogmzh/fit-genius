import { useState, useMemo } from "react";
import Fuse from "fuse.js";

interface Props<T extends Object> {
  data: T[];
  keys: Array<keyof T>;
  filter: ((element: T) => boolean) | null;
}

const SCORE_THRESHOLD = 0.3;

export default function useSearch<T extends Object>({
  data,
  keys,
  filter,
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
    if (!searchQuery && !filter) return data;

    const searchResults: Fuse.FuseResult<T>[] = searchQuery
      ? fuse.search(searchQuery)
      : data.map(item => ({ item, score: 0, refIndex: 0 }));

    return filter === null
      ? searchResults
          .filter(
            fuseResult =>
              fuseResult.score !== undefined &&
              fuseResult.score < SCORE_THRESHOLD
          )
          .map(fuseResult => fuseResult.item)
      : searchResults
          .filter(
            fuseResult =>
              fuseResult.score !== undefined &&
              fuseResult.score < SCORE_THRESHOLD
          )
          .map(fuseResult => fuseResult.item)
          .filter(element => filter(element));
  }, [fuse, searchQuery, data, filter]);

  return {
    searchQuery,
    search: (value: string) => setSearchValue(value),
    results,
  };
}
