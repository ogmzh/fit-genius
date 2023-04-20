import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSupabase } from "../shared/supabase.provider";
import { QUERY_KEYS } from ".";
import {
  DatabaseTables,
  PaymentRow,
  PaymentTable,
} from "../shared/types/database";
import HttpStatusCode from "../shared/http-status-codes";
import { Payment } from "../shared/types/entities";
import { PostgrestError } from "@supabase/supabase-js";

export const usePayments = (clientId?: string) => {
  const { client } = useSupabase();

  const clientQuery = client
    ?.from<DatabaseTables.PAYMENTS, PaymentTable>(DatabaseTables.PAYMENTS)
    .select("*", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .eq("client_id", clientId);

  const { data, isLoading } = useQuery<
    { payments: PaymentRow[]; count: number },
    PostgrestError,
    { payments: Payment[]; count: number }
  >(
    [QUERY_KEYS.payments, clientId],
    async () => {
      const response = await clientQuery;
      return {
        payments: (response?.data as PaymentRow[]) ?? [],
        count: response?.count ?? 0,
      };
    },
    {
      enabled: !!client && !!clientId,
      select: ({ payments, count }) => {
        const paymentsMapped: Payment[] = payments.map(payment => ({
          id: payment.id,
          workouts: payment.workouts,
          isSolo: payment.is_solo,
          createdAt: new Date(payment.created_at),
        }));
        return {
          payments: paymentsMapped,
          count,
        };
      },
    }
  );
  return { data, isLoading };
};

export const useMutatePayments = () => {
  const { client } = useSupabase();

  const queryClient = useQueryClient();

  const createMutation = useMutation(
    [QUERY_KEYS.payments],
    async ({
      userId,
      workouts,
      isSolo,
    }: {
      userId: string;
      workouts: number;
      isSolo: boolean;
    }) => {
      const response = await client
        ?.from<DatabaseTables.PAYMENTS, PaymentTable>(
          DatabaseTables.PAYMENTS
        )
        .insert({
          client_id: userId,
          workouts,
          is_solo: isSolo,
        })
        .select("id");
      return {
        data: response?.data,
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: (data, { userId }) => {
        if (data.status === HttpStatusCode.CREATED) {
          return queryClient.invalidateQueries([
            QUERY_KEYS.payments,
            userId,
          ]);
        }
      },
    }
  );

  const deleteMutation = useMutation(
    [QUERY_KEYS.payments],
    async (id: string) => {
      const response = await client
        ?.from<DatabaseTables.PAYMENTS, PaymentTable>(
          DatabaseTables.PAYMENTS
        )
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
    isLoading: createMutation.isLoading,
    delete: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    isLoadingDelete: deleteMutation.isLoading,
  };
};
