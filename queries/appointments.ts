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
import { SQL_DATE_FORMAT } from "../shared/utils";
import { QUERY_KEYS } from ".";
import { useTheme } from "tamagui";

type EventSchedule = {
  [date: string]: Event[];
};

const EVENT_TIME_FORMAT = "yyyy-MM-dd HH:mm";

export const useAppointmentsData = (
  isFocused: boolean,
  from?: Date,
  to?: Date
) => {
  const { client } = useSupabase();
  console.log("fetching appointmnets for", from, to);
  const { backgroundSoft } = useTheme();

  const clientQuery = client
    ?.from<DatabaseTables.APPOINTMENTS, AppointmentTable>(
      DatabaseTables.APPOINTMENTS
    )
    .select("*, clients(first_name, last_name, email)")
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
            const { day, clients, from, to } = appointment;
            const formatDateTime = (time: string) =>
              format(parseISO(`${day}T${time}`), EVENT_TIME_FORMAT);
            if (clients) {
              if (schedule[day]) {
                Array.isArray(clients)
                  ? schedule[day].push({
                      title: `${clients[0].first_name} ${clients[0].last_name}`,
                      start: formatDateTime(from),
                      end: formatDateTime(to),
                      color: "red",
                    })
                  : schedule[day].push({
                      title: `${clients.first_name} ${clients.last_name}`,
                      start: formatDateTime(from),
                      end: formatDateTime(to),
                      color: backgroundSoft.val,
                    });
              } else {
                schedule[day] = Array.isArray(clients)
                  ? [
                      {
                        title: `${clients[0].first_name} ${clients[0].last_name}`,
                        start: formatDateTime(from),
                        end: formatDateTime(to),
                        color: "red",
                      },
                    ]
                  : [
                      {
                        title: `${clients.first_name} ${clients.last_name}`,
                        start: formatDateTime(from),
                        end: formatDateTime(to),
                        color: backgroundSoft.val,
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
      enabled: !!from && !!to && isFocused,
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

  return {
    createAppointment: createMutation.mutate,
    createAppointmentAsync: createMutation.mutateAsync,
    isLoading: createMutation.isLoading,
  };
};
