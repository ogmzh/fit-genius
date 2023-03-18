import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "../shared/supabase.provider";
import { QUERY_KEYS } from ".";
import { Appointment } from "../shared/types/entities";
import {
  AppointmentTable,
  DatabaseTables,
} from "../shared/types/database";
import HttpStatusCode from "../shared/http-status-codes";

export const useMutateAppointments = () => {
  const { client } = useSupabase();

  const queryClient = useQueryClient();

  const createMutation = useMutation(
    [QUERY_KEYS.appointments],
    async (data: Appointment & { clientIds: string[] }) => {
      const response = await client
        ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
          DatabaseTables.APPOINTMENTS
        )
        .insert({
          day: data.day,
          from: data.from,
          to: data.to,
          // this is actually a many-to-many relation but inserting the client ids here
          // will make the trigger fn pick them up and update the many-to-many table
          client_ids: data.clientIds,
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
          return queryClient.invalidateQueries([QUERY_KEYS.appointments]);
        }
      },
    }
  );

  return {
    createAppointment: createMutation.mutate,
    createAppointmentAsync: createMutation.mutateAsync,
    isLoading: createMutation.isLoading,
  };
};
