import { PostgrestError } from "@supabase/supabase-js";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import HttpStatusCode from "../shared/http-status-codes";
import { useSupabase } from "../shared/supabase.provider";
import {
  Client,
  ClientRow,
  DatabaseTables,
} from "../shared/types/database";
import { ClientUser } from "../shared/types/entities";
import {
  mapClientRowToFormObject,
  mapFormObjectToClientRow,
} from "../shared/utils";
import { ClientUserSchema } from "../shared/validation/client";

export const QUERY_KEYS = {
  clients: "clients",
} as const;

export const useUsersData = () => {
  const { client } = useSupabase();
  const clientQuery = client
    ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
    .select("*", {
      count: "exact",
    });

  const { data, isLoading, isStale } = useQuery<
    { clients: ClientRow[]; count: number },
    PostgrestError,
    { clients: ClientUser[]; count: number }
  >(
    [QUERY_KEYS.clients],
    async () => {
      const response = await clientQuery;
      return {
        clients: response?.data ?? [],
        count: response?.count ?? 0,
      };
    },
    {
      select: ({
        clients,
        count,
      }: {
        clients: ClientRow[];
        count: number;
      }) => {
        const clientsMapped = clients.map(client => ({
          ...mapClientRowToFormObject(client),
          id: client.id,
        }));
        return { clients: clientsMapped, count };
      },
      enabled: !!client && !!clientQuery,
    }
  );
  return { data, isLoading, isStale };
};

export const useUser = (id?: string) => {
  const { client } = useSupabase();
  const clientQuery = client
    ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
    .select("*", {
      count: "exact",
    })
    .eq("id", id);

  const { data, isLoading } = useQuery<
    ClientRow | null,
    PostgrestError,
    ClientUser | null
  >(
    [QUERY_KEYS.clients, id],
    async () => {
      const response = await clientQuery;
      return response?.data?.[0] ?? null;
    },
    {
      select: (client: ClientRow | ClientUser | null) => {
        if (!client) return null;
        // client can be prefetched (preloaded) on user-list screen
        if ("firstName" in client) {
          return client;
        } else {
          return {
            ...mapClientRowToFormObject(client),
            id: client.id,
          };
        }
      },
      enabled: !!client && !!clientQuery && !!id,
    }
  );
  return { data, isLoading };
};

export const useMutateUsers = () => {
  const { client } = useSupabase();

  const queryClient = useQueryClient();

  const createMutation = useMutation(
    [QUERY_KEYS.clients],
    async (data: ClientUserSchema) => {
      const response = await client
        ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
        .insert(mapFormObjectToClientRow(data));
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: data => {
        if (data.status === HttpStatusCode.CREATED) {
          return queryClient.invalidateQueries([QUERY_KEYS.clients]);
        }
      },
    }
  );

  const updateUser = useMutation(
    async ({ id, data }: { id: string; data: ClientUserSchema }) => {
      const response = await client
        ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
        .update(mapFormObjectToClientRow(data))
        .eq("id", id);
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: data => {
        console.log("data response update", data);
        if (data.status === HttpStatusCode.NO_CONTENT) {
          return queryClient.invalidateQueries([QUERY_KEYS.clients]);
        }
      },
    }
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      const response = await client
        ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
        .delete()
        .eq("id", id);
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: data => {
        if (data.status === HttpStatusCode.NO_CONTENT) {
          return queryClient.invalidateQueries([QUERY_KEYS.clients]);
        }
      },
    }
  );

  return {
    create: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    isLoadingCreate: createMutation.isLoading,
    isSuccessCreate: createMutation.isSuccess,
    delete: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    isLoadingDelete: deleteMutation.isLoading,
    isSuccessDelete: deleteMutation.isSuccess,
    update: updateUser.mutate,
    updateAsync: updateUser.mutateAsync,
    isLoadingUpdate: updateUser.isLoading,
    isSuccessUpdate: updateUser.isSuccess,
  };
};
