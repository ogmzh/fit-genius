import { useIsFocused } from "@react-navigation/native";
import {
  addHours,
  endOfMonth,
  format,
  getHours,
  parse,
  setHours,
  startOfMonth,
} from "date-fns";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
} from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { Spinner, YStack, useTheme } from "tamagui";
import ScreenContainer from "../components/screen-container";
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
  const isFocused = useIsFocused();

  const { data: appointments, isLoading } = useAppointmentsData(
    isFocused,
    startOfMonth(parse(selectedDate, SQL_DATE_FORMAT, now)),
    endOfMonth(parse(selectedDate, SQL_DATE_FORMAT, now))
  );
  const { background, secondary, text, textSoft, accent } = useTheme();

  const { push } = useRouter();

  const markedDates: MarkedDates = useMemo(() => {
    return appointments
      ? Object.fromEntries(
          Object.keys(appointments).map(date => [
            date,
            {
              marked: true,
              dots: [{ color: randomColor() }],
            },
          ])
        )
      : {};
  }, [appointments]);

  // heavyweight component
  if (!isFocused) {
    return null;
  }

  const onMonthChange = (month: any, updateSource: any) => {
    console.log(
      "TimelineCalendarScreen onMonthChange:",
      month,
      updateSource
    );
  };

  const theme = {
    selectedDayBackgroundColor: secondary.val,
    calendarBackground: background.val,
    dayTextColor: text.val,
    textDisabledColor: textSoft.val,
    monthTextColor: text.val,
    todayTextColor: accent.val,
  };

  return (
    <ScreenContainer>
      <CalendarProvider
        showTodayButton // Today button will throw a reactimageview source null error when it's not rendered, ignore
        theme={{
          todayButtonTextColor: "white",
          todayButtonFontWeight: "bold",
        }}
        todayButtonStyle={{ backgroundColor: secondary.val }}
        date={selectedDate}
        onDateChanged={date => setSelectedDate(date)}
        onMonthChange={onMonthChange}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
          theme={theme}
        />
        {isLoading && (
          <YStack f={1} jc="center">
            <Spinner size="large" color="$secondary" />
          </YStack>
        )}
        {appointments && (
          <TimelineList
            events={appointments}
            scrollToNow
            showNowIndicator
            timelineProps={{
              start: 7,
              end: 23,
              format24h: false,
              overlapEventsSpacing: 5,
              theme: {
                ...theme,
                // event background is coming from the appointments entity
                eventTitle: {
                  color: text.val,
                  fontWeight: "bold",
                },
                eventTimes: {
                  color: textSoft.val,
                },
                event: {
                  borderRadius: 4,
                },
              },
            }}
          />
        )}
      </CalendarProvider>
    </ScreenContainer>
  );
};

export default AppointmentScreen;
