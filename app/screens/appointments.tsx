import { addHours, addWeeks, format, getHours, setHours } from "date-fns";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { Agenda, AgendaEntry, Timeline } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { FloatingActionButton } from "../components/floating-action-button";
import { useAppointmentsData } from "../queries/appointments";
import { SQL_DATE_FORMAT, TIME_FORMAT } from "../shared/utils";

const randomColor = () =>
  `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;

const now = new Date();
const today = format(now, SQL_DATE_FORMAT);

const newAppointmentQueryDateString = (
  selectedDay: string,
  withHours = false
) => {
  const selected = withHours
    ? new Date(selectedDay)
    : setHours(new Date(selectedDay), getHours(now) + 1);
  const nextTimeslot =
    selected.getMinutes() === 0
      ? selected
      : new Date(selected.setMinutes(0));

  return `date=${format(selected, SQL_DATE_FORMAT)}&from=${format(
    nextTimeslot,
    TIME_FORMAT
  )}&to=${format(addHours(nextTimeslot, 1), TIME_FORMAT)}`;
};

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const selectedDateObject = new Date(selectedDate);
  const { data: appointments } = useAppointmentsData(
    addWeeks(selectedDateObject, -1),
    addWeeks(selectedDateObject, 1)
  );

  const { push } = useRouter();

  const markedDates: MarkedDates = useMemo(() => {
    return appointments
      ? Object.fromEntries(
          Object.keys(appointments).map(date => [
            date,
            {
              dots: [{ color: randomColor() }],
            },
          ])
        )
      : {};
  }, [appointments]);

  return (
    <SafeAreaView className="flex flex-1 py-4 bg-slate-100">
      <Agenda
        firstDay={1}
        items={appointments}
        markingType="multi-dot"
        selected={selectedDate}
        markedDates={markedDates}
        onDayPress={day => setSelectedDate(day.dateString)}
        showClosingKnob
        renderList={items => {
          return (
            <MyTimeline
              entries={items.items?.[selectedDate]}
              day={selectedDate}
            />
          );
        }}
      />
      <FloatingActionButton
        onPress={() =>
          push(
            `appointments/new?${newAppointmentQueryDateString(
              selectedDate
            )}`
          )
        }
      />
    </SafeAreaView>
  );
};

const MyTimeline = ({
  entries,
  day,
}: {
  entries?: AgendaEntry[];
  day: string;
}) => {
  const { push } = useRouter();

  return (
    <Timeline
      showNowIndicator
      date={day}
      timelineLeftInset={60}
      scrollToNow={true}
      onBackgroundLongPress={day => {
        push(
          `appointments/new?${newAppointmentQueryDateString(day, true)}`
        );
      }}
      onEventPress={event => push(`appointments/${event.id}`)}
      events={
        entries?.map(entry => ({
          start: `${day} ${entry?.day.split("-")[0]}`,
          end: `${day} ${entry?.day.split("-")[1]}`,
          title: entry?.name ?? "Workout",
          summary: "Summary placeholder",
        })) ?? []
      }
    />
  );
};

export default AppointmentScreen;
