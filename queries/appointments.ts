import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { TimelineEventProps as Event } from "react-native-calendars";

import { PostgrestError } from "@supabase/supabase-js";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import HttpStatusCode from "../shared/http-status-codes";
import { useSupabase } from "../shared/supabase.provider";
import {
  AppointmentTable,
  DatabaseTables,
} from "../shared/types/database";
import {
  ExtendedAppointmentRow,
  NewAppointment,
} from "../shared/types/entities";
import { EVENT_TIME_FORMAT, SQL_DATE_FORMAT } from "../shared/utils";
import { QUERY_KEYS } from ".";
import { useTheme } from "tamagui";

type EventSchedule = {
  [date: string]: Event[];
};

export const useAppointmentsData = (
  isFocused: boolean,
  from?: Date | null,
  to?: Date | null
) => {
  const { client } = useSupabase();
  const { backgroundSoft, primary } = useTheme();

  const clientQuery = client
    ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
      DatabaseTables.APPOINTMENTS
    )
    .select(
      "*, clients(first_name, last_name, email, workouts_group, workouts_solo)"
    )
    .gte("day", format(from ?? new Date(), SQL_DATE_FORMAT))
    .lte("day", format(to ?? new Date(), SQL_DATE_FORMAT));

  const { data, isLoading, isStale } = useQuery<
    {
      appointments: ExtendedAppointmentRow[];
    },
    PostgrestError,
    EventSchedule
  >(
    [QUERY_KEYS.appointments, from, to],
    async () => {
      const response = await clientQuery;
      return {
        appointments: response?.data ?? [],
      };
    },
    {
      select: ({
        appointments,
      }: {
        appointments: ExtendedAppointmentRow[];
      }) => {
        const scheduleMapped: EventSchedule = appointments.reduce(
          (schedule, appointment) => {
            const { day, clients, from, to, id, client_id } = appointment;
            const formatDateTime = (time: string) =>
              format(parseISO(`${day}T${time}`), EVENT_TIME_FORMAT);
            if (clients) {
              // since the EventSchedule type is a bit scuffed, need to pass additional info through somewhere
              const isSolo = Array.isArray(clients)
                ? Boolean(
                    clients[0].workouts_solo &&
                      clients[0].workouts_solo > 0
                  )
                : Boolean(
                    clients.workouts_solo && clients.workouts_solo > 0
                  );

              const remainingSoloWorkouts = Array.isArray(clients)
                ? clients[0].workouts_solo
                : clients.workouts_solo;

              const remainingGroupWorkouts = Array.isArray(clients)
                ? clients[0].workouts_group
                : clients.workouts_group;
              const eventId = `{"appointment_id":"${id}", "client_id":"${client_id}", "solo": "${isSolo}"}`;
              if (schedule[day]) {
                Array.isArray(clients)
                  ? schedule[day].push({
                      id: eventId,
                      title: `${clients[0].first_name} ${clients[0].last_name}`,
                      summary: isSolo
                        ? `Solo \n${remainingSoloWorkouts ?? 0} remaining`
                        : `Group \n${
                            remainingGroupWorkouts ?? 0
                          } remaining`,
                      start: formatDateTime(from),
                      end: formatDateTime(to),
                      color: isSolo ? primary.val : backgroundSoft.val,
                    })
                  : schedule[day].push({
                      id: eventId,
                      title: `${clients.first_name} ${clients.last_name}`,
                      summary: isSolo
                        ? `Solo \n${remainingSoloWorkouts ?? 0} remaining`
                        : `Group \n${
                            remainingGroupWorkouts ?? 0
                          } remaining`,
                      start: formatDateTime(from),
                      end: formatDateTime(to),
                      color: isSolo ? primary.val : backgroundSoft.val,
                    });
              } else {
                schedule[day] = Array.isArray(clients)
                  ? [
                      {
                        id: eventId,
                        title: `${clients[0].first_name} ${clients[0].last_name}`,
                        summary: isSolo
                          ? `Solo \n${
                              remainingSoloWorkouts ?? 0
                            } remaining`
                          : `Group \n${
                              remainingGroupWorkouts ?? 0
                            } remaining`,
                        start: formatDateTime(from),
                        end: formatDateTime(to),
                        color: isSolo ? primary.val : backgroundSoft.val,
                      },
                    ]
                  : [
                      {
                        id: eventId,
                        title: `${clients.first_name} ${clients.last_name}`,
                        summary: isSolo
                          ? `Solo \n${
                              remainingSoloWorkouts ?? 0
                            } remaining`
                          : `Group \n${
                              remainingGroupWorkouts ?? 0
                            } remaining`,
                        start: formatDateTime(from),
                        end: formatDateTime(to),
                        color: isSolo ? primary.val : backgroundSoft.val,
                      },
                    ];
              }
            }
            return schedule;
          },
          {} as EventSchedule
        );
        return scheduleMapped;
      },
      enabled: !!from && isFocused,
    }
  );
  return { data, isLoading, isStale };
};

export const useMutateAppointments = () => {
  const { client } = useSupabase();

  const queryClient = useQueryClient();
  const createMutation = useMutation(
    [QUERY_KEYS.appointments],
    async (data: NewAppointment) => {
      const { clientIds, day, from, to } = data;
      await client
        ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
          DatabaseTables.APPOINTMENTS
        )
        .delete()
        .eq("day", day)
        .eq("from", formatInTimeZone(from, "UTC", "HH:mmX"))
        .eq("to", formatInTimeZone(to, "UTC", "HH:mmX"));
      const response = await client
        ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
          DatabaseTables.APPOINTMENTS
        )
        .insert(
          clientIds.map(clientId => ({
            day: day,
            from: formatInTimeZone(from, "UTC", "HH:mmX"),
            to: formatInTimeZone(to, "UTC", "HH:mmX"),
            client_id: clientId,
          }))
        );

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

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      date,
      from,
      to,
    }: {
      id: string;
      date: Date;
      from: Date;
      to: Date;
    }) => {
      const response = await client
        ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
          DatabaseTables.APPOINTMENTS
        )
        .update({
          day: format(date, SQL_DATE_FORMAT),
          from: formatInTimeZone(from, "UTC", "HH:mmX"),
          to: formatInTimeZone(to, "UTC", "HH:mmX"),
        })
        .eq("id", id);
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    onSuccess: data => {
      if (data.status === HttpStatusCode.NO_CONTENT) {
        return queryClient.invalidateQueries([QUERY_KEYS.appointments]);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await client
        ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
          DatabaseTables.APPOINTMENTS
        )
        .delete()
        .eq("id", id);
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    onSuccess: () =>
      queryClient.invalidateQueries([QUERY_KEYS.appointments]),
  });

  return {
    createAppointment: createMutation.mutate,
    createAppointmentAsync: createMutation.mutateAsync,
    isLoading: createMutation.isLoading,
    deleteAppointment: deleteMutation.mutate,
    deleteAppointmentAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isLoading,
    updateAppointment: updateMutation.mutate,
    updateAppointmentAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isLoading,
  };
};
