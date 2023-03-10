import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useSupabase } from "../shared/supabase.provider";
import {
  Client,
  ClientRow,
  DatabaseTables,
} from "../shared/types/database";
import { UserSchemaFormValues } from "../(tabs)/users/user-form";
import { formatISO } from "date-fns";

export const QUERY_KEYS = {
  clients: "clients",
} as const;

export const useClientsData = () => {
  const { client } = useSupabase();
  const clientQuery = client
    ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
    .select("*", {
      count: "exact",
    });

  const { data, isLoading } = useQuery<{
    clients: ClientRow[];
    count: number;
  }>(
    [QUERY_KEYS.clients],
    async () => {
      const response = await clientQuery;
      return {
        clients: response?.data ?? [],
        count: response?.count ?? 0,
      };
    },
    {
      enabled: !!client && !!clientQuery,
    }
  );
  return { data, isLoading };
};

export const useMutateClientData = () => {
  const { client } = useSupabase();

  const queryClient = useQueryClient();

  const userMutation = useMutation(
    async (data: UserSchemaFormValues) => {
      const response = await client
        ?.from<DatabaseTables.CLIENTS, Client>(DatabaseTables.CLIENTS)
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email || null,
          phone_number: data.phoneNumber || null,
          height:
            data.height && typeof data.height === "number"
              ? Number(data.height)
              : null,
          weight:
            data.weight && typeof data.weight === "number"
              ? Number(data.weight)
              : null,
          date_of_birth: data.dateOfBirth
            ? formatISO(data.dateOfBirth)
            : null,
          goals: data.goals || null,
          notes: data.notes || null,
        });
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: () => queryClient.invalidateQueries([QUERY_KEYS.clients]),
    }
  );
  return {
    mutate: userMutation.mutate,
    mutateAsync: userMutation.mutateAsync,
    isLoading: userMutation.isLoading,
    isSuccess: userMutation.isSuccess,
  };
};
