import { addHours, format } from "date-fns";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { Agenda, AgendaEntry, Timeline } from "react-native-calendars";
import {
  AgendaSchedule,
  MarkedDates,
} from "react-native-calendars/src/types";
import { FloatingActionButton } from "../components/floating-action-button";
import { useRouter } from "expo-router";
import { SQL_DATE_FORMAT, TIME_FORMAT } from "../shared/utils";

const events: AgendaSchedule = {
  "2023-03-12": [
    {
      name: "Ognjen Mišić, Milan Šušnjar, Marko Bajić, Mirko Bajić",
      height: 120,
      day: "10:00-11:00",
    },
    { name: "Lunch with team", height: 60, day: "11:00-12:30" },
    { name: "Workout", height: 60, day: "12:00-13:00" },
  ],
  "2023-03-15": [
    { name: "Project deadline", height: 60, day: "12:00-13:00" },
  ],
  "2023-03-17": [
    {
      name: "Presentation with investors",
      height: 60,
      day: "15:00-16:00",
    },
  ],
};

const randomColor = () =>
  Math.floor(Math.random() * 16_777_215).toString(16);

const today = format(new Date(), "yyyy-MM-dd");

const newAppointmentQueryDateString = () => {
  const now = new Date();

  const nextTimeslot =
    now.getMinutes() === 0
      ? now
      : new Date(addHours(now, 1).setMinutes(0));

  return `date=${format(now, SQL_DATE_FORMAT)}&from=${format(
    nextTimeslot,
    TIME_FORMAT
  )}&to=${format(addHours(nextTimeslot, 1), TIME_FORMAT)}`;
};

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(today);

  const { push } = useRouter();

  const markedDates: MarkedDates = useMemo(
    () =>
      Object.keys(events).reduce((accumulator, key) => {
        return {
          ...accumulator,
          [key]: {
            dots: events[key].map(event => ({
              key: event.name,
              color: `#${randomColor()}`,
            })),
          },
        };
      }, {}),
    []
  );

  return (
    <SafeAreaView className="flex flex-1 py-4 bg-slate-100">
      <Agenda
        firstDay={1}
        items={events}
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
          push(`appointments/new?${newAppointmentQueryDateString()}`)
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
  return (
    <Timeline
      showNowIndicator
      date={day}
      timelineLeftInset={60}
      scrollToNow={true}
      onBackgroundLongPress={day =>
        console.log("background long press", day)
      }
      onEventPress={event => console.log("event press", event)}
      events={
        entries?.map(entry => ({
          start: `${day} ${entry?.day.split("-")[0]}`,
          end: `${day} ${entry?.day.split("-")[1]}`,
          title: entry?.name ?? "wut",
          summary:
            "well hello there\ngeneral kenobi\nognjen mišić\nkako si",
        })) ?? []
      }
    />
  );
};

export default ScheduleScreen;
