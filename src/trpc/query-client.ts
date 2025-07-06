import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";
/**
 * Creates and returns a new QueryClient instance with custom default options for query caching, hydration, and dehydration.
 *
 * The client uses a 30-second stale time for queries and integrates superjson for serializing and deserializing query data during hydration and dehydration. Queries are dehydrated if they meet the default criteria or if their status is "pending".
 *
 * @returns A configured QueryClient instance
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
