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
  TimelineEventProps as Event,
  ExpandableCalendar,
  TimelineList,
} from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import {
  AnimatePresence,
  Button,
  Paragraph,
  Sheet,
  Spinner,
  XStack,
  YStack,
  useTheme,
} from "tamagui";

import { useIsFocused } from "@react-navigation/native";

import { Check, Trash, X } from "@tamagui/lucide-icons";
import { AppointmentPicker } from "../components/appointment-picker";
import { ConfirmDialog } from "../components/confirm-dialog";
import { FloatingActionButton } from "../components/floating-action-button";
import ScreenContainer from "../components/screen-container";
import {
  useAppointmentsData,
  useMutateAppointments,
} from "../queries/appointments";
import {
  CALENDAR_DATE_FORMAT,
  SQL_DATE_FORMAT,
  TIME_FORMAT,
} from "../shared/utils";
import { isEqual } from "lodash-es";

const START_TIME = 7;

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [updatedEventTime, setUpdatedEventTime] = useState<{
    from: Date;
    to: Date;
    date: Date;
  } | null>(null);

  const { data: appointments, isLoading } = useAppointmentsData(
    isFocused,
    startOfMonth(parse(selectedDate, SQL_DATE_FORMAT, now)),
    endOfMonth(parse(selectedDate, SQL_DATE_FORMAT, now))
  );

  const {
    deleteAppointmentAsync,
    isDeleting,
    isUpdating,
    updateAppointmentAsync,
  } = useMutateAppointments();

  const {
    background,
    backgroundDisabled,
    secondary,
    text,
    textSoft,
    accent,
  } = useTheme();

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
      setSelectedEvent(null);
    }
  }, [isFocused]);

  // heavyweight component
  if (!isFocused) {
    return null;
  }

  const handleCloseSheet = () => {
    setSelectedEvent(null);
    setUpdatedEventTime(null);
  };

  const handleConfirmAppointmentChange = async () => {
    if (selectedEvent && updatedEventTime) {
      await updateAppointmentAsync({
        id: JSON.parse(selectedEvent.id!).appointment_id,
        date: updatedEventTime.date,
        from: updatedEventTime.from,
        to: updatedEventTime.to,
      });
      setSelectedEvent(null);
      setUpdatedEventTime(null);
    }
  };

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

  const showTimepickerControls =
    (selectedEvent &&
      !isEqual(updatedEventTime, {
        from: parse(selectedEvent.start, CALENDAR_DATE_FORMAT, now),
        to: parse(selectedEvent.end, CALENDAR_DATE_FORMAT, now),
        date: parse(selectedEvent.start, CALENDAR_DATE_FORMAT, now),
      })) ??
    false;

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
            scrollToFirst
            scrollToNow
            showNowIndicator
            timelineProps={{
              onEventPress: (event: Event) => {
                setSelectedEvent(event);
                setUpdatedEventTime({
                  date: parse(event.start, CALENDAR_DATE_FORMAT, now),
                  from: parse(event.start, CALENDAR_DATE_FORMAT, now),
                  to: parse(event.end, CALENDAR_DATE_FORMAT, now),
                });
              },
              onBackgroundLongPress: timeString =>
                push(
                  `appointments/new?${newAppointmentQueryDateString(
                    timeString,
                    true
                  )}`
                ),
              // if we use start/end props instead of unavailable hours,
              // the NOW line gets offset for however many hours se set as START_TIME x(
              unavailableHours: [
                {
                  start: 0,
                  end: START_TIME,
                },
                {
                  start: 22,
                  end: 24,
                },
              ],
              unavailableHoursColor: backgroundDisabled.val,
              format24h: true,
              overlapEventsSpacing: 5,
              date: selectedDate,
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
        open={!!selectedEvent}
        snapPoints={[41, 55]}
        position={
          isDeleting || isUpdating ? 0 : showTimepickerControls ? 2 : 1
        }
        dismissOnSnapToBottom
        dismissOnOverlayPress
        onOpenChange={() => setSelectedEvent(null)}>
        <Sheet.Overlay bg="$backgroundSoft" />
        <Sheet.Handle bg="$primary" />
        <Sheet.Frame f={1} p="$4" space="$5" borderTopColor="red">
          <YStack>
            {selectedEvent && (
              <XStack ai="center" jc="space-between">
                <Paragraph size="$6" fow="bold">
                  {selectedEvent.title}
                </Paragraph>
              </XStack>
            )}
            {isDeleting || isUpdating ? (
              <Spinner size="large" />
            ) : (
              <YStack mt="$4">
                <YStack w="$15" alignSelf="center">
                  <AppointmentPicker
                    size="small"
                    date={updatedEventTime?.date ?? new Date()}
                    onDateChange={date =>
                      setUpdatedEventTime(previous => {
                        if (previous) {
                          return {
                            ...previous,
                            date,
                          };
                        }
                        return null;
                      })
                    }
                    onTimeFromChange={time =>
                      setUpdatedEventTime(previous => {
                        if (previous) {
                          return {
                            ...previous,
                            from: time,
                            to: addHours(time, 1),
                          };
                        }
                        return null;
                      })
                    }
                    onTimeToChange={time =>
                      setUpdatedEventTime(previous => {
                        if (previous) {
                          return {
                            ...previous,
                            to: time,
                          };
                        }
                        return null;
                      })
                    }
                    timeFrom={updatedEventTime?.from ?? new Date()}
                    timeTo={updatedEventTime?.to ?? new Date()}
                  />
                  <AnimatePresence>
                    {showTimepickerControls && (
                      <XStack
                        key="controls"
                        gap="$4"
                        jc="center"
                        enterStyle={{
                          scale: 1.2,
                          opacity: 0,
                        }}
                        exitStyle={{
                          scale: 1.2,
                          opacity: 0,
                        }}
                        opacity={1}
                        scale={1}
                        y={0}
                        elevation="$4"
                        animation="lazy">
                        <Button
                          circular
                          onPress={() => handleConfirmAppointmentChange()}
                          icon={Check}
                          bg="$accent"
                          color="white"
                          scaleIcon={1.8}
                        />
                        <Button
                          circular
                          icon={X}
                          onPress={() => handleCloseSheet()}
                          bg="$warning"
                          pressStyle={{
                            bg: "$error",
                          }}
                          color="white"
                          scaleIcon={1.8}
                        />
                      </XStack>
                    )}
                  </AnimatePresence>
                </YStack>
                <XStack mt="$9">
                  <ConfirmDialog
                    title="Delete"
                    onConfirm={async () => {
                      if (selectedEvent?.id) {
                        await deleteAppointmentAsync(
                          JSON.parse(selectedEvent.id!).appointment_id
                        );
                        setSelectedEvent(null);
                      }
                    }}
                    description={`Are you sure you want to remove this appointment?`}>
                    <Button
                      circular
                      size="$4"
                      disabled={isDeleting}
                      icon={<Trash size="$1.5" />}
                      backgroundColor="$danger"
                      color="white"
                      pressStyle={{
                        bg: "$warning",
                      }}
                    />
                  </ConfirmDialog>
                </XStack>
              </YStack>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </ScreenContainer>
  );
};

export default AppointmentScreen;
