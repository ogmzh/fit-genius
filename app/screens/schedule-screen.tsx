import { SafeAreaView, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { memo, useState } from "react";
import {
  Calendar,
  CalendarList,
  Agenda,
  Timeline,
  AgendaEntry,
} from "react-native-calendars";

const events = {
  "2023-03-12": [
    { name: "Meeting with client", height: 60, day: "10:00-11:00" },
    { name: "Lunch with team", height: 60, day: "10:00-11:00" },
    { name: "Workout", height: 60, day: "12:00-13:00" },
  ],
  "2023-03-15": [
    { name: "Project deadline", height: 60, day: "2023-03-15" },
  ],
  "2023-03-20": [
    {
      name: "Presentation with investors",
      height: 60,
      day: "2023-03-20",
    },
  ],
};

const vacation = {
  key: "vacation",
  color: "red",
  selectedDotColor: "blue",
};
const massage = {
  key: "massage",
  color: "blue",
  selectedDotColor: "blue",
};
const workout = { key: "workout", color: "green" };
const ScheduleScreen = () => {
  return (
    <SafeAreaView className="flex flex-1 py-4 bg-slate-100">
      <Agenda
        items={events}
        markingType="multi-dot"
        markedDates={{
          "2023-03-12": {
            dots: [vacation, massage, workout],
            selected: true,
          },
        }}
        showClosingKnob
        renderList={items => {
          return (
            <MyTimeline
              entries={items.items?.["2023-03-12"]}
              day="2023-03-12"
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const MyTimeline = memo(
  ({ entries, day }: { entries?: AgendaEntry[]; day: string }) => {
    console.log("renderin an entry", entries);
    return (
      <Timeline
        showNowIndicator
        date={day}
        scrollToNow
        events={
          entries?.map(entry => ({
            start: `${day} ${entry?.day.split("-")[0]}`,
            end: `${day} ${entry?.day.split("-")[1]}`,
            title: entry?.name ?? "wut",
          })) ?? []
          // [
          // {
          //   start: "2023-03-12 10:00",
          //   end: "2023-03-12 11:00",
          //   title: entry?.name ?? "wut",
          // },
          // ]
        }
      />
    );
  },
  (previous, next) => previous.entry?.name === next.entry?.name
);

export default ScheduleScreen;
