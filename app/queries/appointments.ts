import { formatInTimeZone } from "date-fns-tz";
import { AgendaSchedule } from "react-native-calendars";

import { PostgrestError } from "@supabase/supabase-js";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import HttpStatusCode from "../shared/http-status-codes";
import { useSupabase } from "../shared/supabase.provider";
import {
  AppointmentClientRows,
  AppointmentTable,
  DatabaseTables,
} from "../shared/types/database";
import { Appointment } from "../shared/types/entities";
import { QUERY_KEYS } from "./";

export const useAppointmentsData = (from?: Date, to?: Date) => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  const { data, isLoading, isStale } = useQuery<
    {
      appointments: AppointmentClientRows;
    },
    PostgrestError,
    AgendaSchedule
  >(
    [QUERY_KEYS.appointments],
    async () => {
      const response = await client?.rpc("appointment_clients_by_date", {
        start_date: from!.toISOString(),
        end_date: to!.toISOString(),
      });

      return {
        appointments: response?.data ?? [],
      };
    },
    {
      select: ({
        appointments,
      }: {
        appointments: AppointmentClientRows;
      }) => {
        const scheduleMapped: AgendaSchedule = appointments.reduce(
          (schedule, appointment) => {
            const { day, first_name, last_name, time_from, time_to } =
              appointment;
            if (schedule[day]) {
              schedule[day].push({
                name: `${first_name} ${last_name}`,
                height: 80,
                day: `${time_from}-${time_to}`,
              });
            } else {
              schedule[day] = [
                {
                  name: `${first_name} ${last_name}`,
                  height: 80,
                  day: `${time_from}-${time_to}`,
                },
              ];
            }
            return schedule;
          },
          {} as AgendaSchedule
        );
        return scheduleMapped;
      },
      enabled: !!from && !!to,
      onSuccess: () =>
        queryClient.invalidateQueries([QUERY_KEYS.appointments]),
    }
  );
  return { data, isLoading, isStale };
};

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
          from: formatInTimeZone(data.from, "UTC", "HH:mmX"),
          to: formatInTimeZone(data.to, "UTC", "HH:mmX"),
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
