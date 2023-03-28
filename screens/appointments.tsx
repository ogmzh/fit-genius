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
import { useEffect, useMemo, useState } from "react";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
  TimelineEventProps as Event,
} from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import {
  Button,
  Paragraph,
  Sheet,
  Spinner,
  Stack,
  XStack,
  YStack,
  useTheme,
} from "tamagui";

import { useIsFocused } from "@react-navigation/native";

import { Trash } from "@tamagui/lucide-icons";
import { ConfirmDialog } from "../components/confirm-dialog";
import { FloatingActionButton } from "../components/floating-action-button";
import ScreenContainer from "../components/screen-container";
import {
  useAppointmentsData,
  useMutateAppointments,
} from "../queries/appointments";
import { SQL_DATE_FORMAT, TIME_FORMAT } from "../shared/utils";
import { AppointmentPicker } from "../components/appointment-picker";

const START_TIME = 7;

const randomColor = () =>
  `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;

const now = new Date();
const today = format(now, SQL_DATE_FORMAT);

const newAppointmentQueryDateString = (
  selectedDay: string,
  withHours = false
) => {
  // silly library doesn't pass hours as time but how many hours have passed since the start of the workday
  const selected = withHours
    ? addHours(new Date(selectedDay), START_TIME)
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
  const [showEventOptions, setShowEventOptions] = useState<Event | null>(
    null
  );

  const { data: appointments, isLoading } = useAppointmentsData(
    isFocused,
    startOfMonth(parse(selectedDate, SQL_DATE_FORMAT, now)),
    endOfMonth(parse(selectedDate, SQL_DATE_FORMAT, now))
  );

  const { deleteAppointmentAsync, isDeleting } = useMutateAppointments();

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

  useEffect(() => {
    if (!isFocused) {
      setShowEventOptions(null);
    }
  }, [isFocused]);

  // heavyweight component
  if (!isFocused) {
    return null;
  }

  const onMonthChange = (month: DateData) => {
    setSelectedDate(month.dateString);
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
              onEventPress: (event: Event) => setShowEventOptions(event),
              onBackgroundLongPress: timeString =>
                push(
                  `appointments/new?${newAppointmentQueryDateString(
                    timeString,
                    true
                  )}`
                ),
              start: START_TIME,
              end: 23,
              format24h: true,
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
      <FloatingActionButton
        onPress={() =>
          push(
            `appointments/new?${newAppointmentQueryDateString(
              selectedDate
            )}`
          )
        }
      />
      <Sheet
        open={!!showEventOptions}
        snapPoints={[50, 20]}
        dismissOnSnapToBottom
        dismissOnOverlayPress
        onOpenChange={() => setShowEventOptions(null)}>
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4" space="$5">
          <YStack>
            {showEventOptions && (
              <XStack ai="center" jc="space-between">
                <Paragraph size="$6" fow="bold">
                  {showEventOptions.title}
                </Paragraph>
              </XStack>
            )}
            {isDeleting ? (
              <Spinner size="large" />
            ) : (
              <YStack mt="$4">
                <YStack w="$15" alignSelf="center">
                  <AppointmentPicker
                    size="small"
                    date={new Date()}
                    onDateChange={() => {}}
                    onTimeFromChange={() => {}}
                    onTimeToChange={() => {}}
                    timeFrom={new Date()}
                    timeTo={new Date()}
                  />
                </YStack>
                <ConfirmDialog
                  title="Delete"
                  onConfirm={async () => {
                    if (showEventOptions?.id) {
                      await deleteAppointmentAsync(showEventOptions.id);
                      setShowEventOptions(null);
                    }
                  }}
                  description={`Are you sure you want to remove this appointment?`}>
                  <Button
                    circular
                    size="$5"
                    disabled={isDeleting}
                    icon={<Trash size="$2" />}
                    backgroundColor="$warning"
                    color="white"
                    pressStyle={{
                      bg: "$danger",
                    }}
                  />
                </ConfirmDialog>
              </YStack>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </ScreenContainer>
  );
};

export default AppointmentScreen;
