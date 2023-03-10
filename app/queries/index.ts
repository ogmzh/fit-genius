import { formatISO } from 'date-fns';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserSchemaFormValues } from '../(tabs)/users/user-form';
import HttpStatusCode from '../shared/http-status-codes';
import { useSupabase } from '../shared/supabase.provider';
import { Client, ClientRow, DatabaseTables } from '../shared/types/database';

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

export const useMutateUsers = () => {
  const { client } = useSupabase();

  const queryClient = useQueryClient();

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
        console.log("what is ddaatataaa", data)
        if (data.status === HttpStatusCode.NO_CONTENT) {
          console.log("invalidate all clients")
          return queryClient.invalidateQueries([QUERY_KEYS.clients]);
        }
      },
    }
  );

  const createMutation = useMutation(
    [QUERY_KEYS.clients],
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
      onSuccess: data => {
        if (data.status === HttpStatusCode.CREATED) {
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
  };
};
