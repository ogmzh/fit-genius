import { addHours, format } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import Toast from "react-native-toast-message";
import { XStack, YStack, useTheme } from "tamagui";

import { useIsFocused } from "@react-navigation/native";

import { ActionButton } from "../components/action-button";
import { AppointmentPicker } from "../components/appointment-picker";
import { BackdropSpinner } from "../components/backdrop-spinner";
import { ClientCard } from "../components/client-card";
import ScreenContainer from "../components/screen-container";
import {
  useAppointmentsData,
  useMutateAppointments,
} from "../queries/appointments";
import { useUsersData } from "../queries/clients";
import { toastWarningStyleProps } from "../shared/toast";
import { ClientUser } from "../shared/types/entities";
import { EVENT_TIME_FORMAT, SQL_DATE_FORMAT } from "../shared/utils";
import { DebouncedInput } from "../components/debounced-input";
import useSearch from "../shared/hooks/use-search";

const now = new Date();

const NewAppointmentScreen = () => {
  const {
    date: queryDate,
    from: queryFrom,
    to: queryTo,
  } = useLocalSearchParams<{ date: string; from: string; to: string }>();

  const [timeFrom, setTimeFrom] = useState<Date | null>();
  const [timeTo, setTimeTo] = useState<Date | null>();
  const [selectedDate, setSelectedDate] = useState<Date>(
    queryDate ? new Date(queryDate) : now
  );
  const [selectedUsers, setSelectedUsers] = useState<ClientUser[]>([]);

  const isFocused = useIsFocused();
  const theme = useTheme();

  //TODO: figure out what did i want to do with this ID
  const { appointment: id } = useLocalSearchParams<{
    appointment: string;
  }>();
  const { data: selectedDayAppointments } = useAppointmentsData(
    isFocused,
    selectedDate,
    selectedDate
  );
  const { data: clientData } = useUsersData();

  const {
    results: filteredClients,
    searchQuery,
    search,
  } = useSearch<ClientUser>({
    data: clientData?.clients ?? [],
    keys: ["firstName", "lastName", "email"],
  });

  useEffect(() => {
    if (selectedDayAppointments && timeFrom && timeTo) {
      // preselects users that have already been appointed to the selected slot
      const selectedDayAppointment =
        selectedDayAppointments[format(selectedDate, SQL_DATE_FORMAT)];
      if (selectedDayAppointment) {
        const existingAppointments = selectedDayAppointment.filter(
          appointment =>
            appointment.start === format(timeFrom, EVENT_TIME_FORMAT) &&
            appointment.end === format(timeTo, EVENT_TIME_FORMAT)
        );
        const existingUserIds = new Set(
          existingAppointments.map(
            appointment => JSON.parse(appointment.id!).client_id
          )
        );

        setSelectedUsers(
          clientData?.clients.filter(user =>
            existingUserIds.has(user.id)
          ) ?? []
        );
      }
    } else {
      setSelectedUsers([]);
    }
  }, [selectedDayAppointments, timeFrom, timeTo]);

  const { createAppointmentAsync, isLoading: isMutating } =
    useMutateAppointments();

  const queryDateTimeFrom = queryFrom
    ? new Date(`${queryDate}T${queryFrom}`)
    : now; // shouldn't resolve to now as we have to pass these query params

  const queryDateTimeTo = queryTo
    ? new Date(`${queryDate}T${queryTo}`)
    : now; // shouldn't resolve to now as we have to pass these query params

  useEffect(() => {
    if (!timeFrom && queryDateTimeFrom) {
      setTimeFrom(queryDateTimeFrom);
    }
  }, [timeFrom, queryDateTimeFrom]);

  useEffect(() => {
    if (!timeTo && queryDateTimeTo) {
      setTimeTo(queryDateTimeTo);
    }
  }, [timeTo, queryDateTimeTo]);

  useEffect(() => {
    if (timeFrom) {
      setTimeTo(addHours(timeFrom, 1));
    }
  }, [timeFrom]);

  const { canGoBack, goBack, addListener } = useNavigation();

  const toggleSelectedUser = (user: ClientUser) => {
    if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter(selectedUser => selectedUser.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const onConfirmPress = async () => {
    if (timeFrom && timeTo && selectedUsers.length > 0) {
      await createAppointmentAsync({
        clientIds: selectedUsers.map(user => user.id!),
        day: format(selectedDate, SQL_DATE_FORMAT),
        from: timeFrom,
        to: timeTo,
      });
      addListener("beforeRemove", () => {
        const todayAppointment =
          selectedDayAppointments?.[format(selectedDate, SQL_DATE_FORMAT)];

        if (todayAppointment) {
          const appointedUserIds = new Set(
            todayAppointment
              .filter(
                appointment =>
                  appointment.start !== format(timeFrom, EVENT_TIME_FORMAT)
              )
              .map(appointment => JSON.parse(appointment.id!).client_id)
          );
          const duplicatedAppointments = selectedUsers.filter(user =>
            appointedUserIds.has(user.id)
          );
          if (duplicatedAppointments.length > 0) {
            Toast.show({
              type: "styled",
              props: toastWarningStyleProps(theme),
              text1: "Multiple appointments",
              visibilityTime: 7000,
              text2:
                duplicatedAppointments.length > 1 &&
                selectedUsers.length > 1
                  ? `${duplicatedAppointments[0].firstName} ${duplicatedAppointments[0].lastName} and others...`
                  : `${duplicatedAppointments[0].firstName} ${duplicatedAppointments[0].lastName}`,
            });
          }
        }
      });
      canGoBack() && goBack();
    }
  };

  return (
    <ScreenContainer>
      <BackdropSpinner visible={isMutating} />
      <YStack mb="$12">
        <AppointmentPicker
          date={selectedDate}
          onDateChange={setSelectedDate}
          timeFrom={timeFrom}
          onTimeFromChange={setTimeFrom}
          timeTo={timeTo}
          onTimeToChange={setTimeTo}
          disabled={isMutating}
        />
        <DebouncedInput
          containerProps={{
            mb: "$4",
            mx: "$6",
          }}
          inputProps={{
            placeholder: "Search...",
          }}
          value={searchQuery}
          onValueChange={value => search(value)}
        />
        <FlatList
          data={filteredClients}
          renderItem={({ item: user }) => (
            <ClientCard
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              isSelected={selectedUsers.some(
                selectedUser => selectedUser.id === user.id
              )}
              onPress={() => toggleSelectedUser(user)}
            />
          )}
          keyExtractor={item => item.id!}
          contentContainerStyle={{ paddingBottom: 200 }}
          ListFooterComponent={() => (
            <XStack alignSelf="center" gap="$4">
              <ActionButton
                onPress={() => setSelectedUsers([])}
                pressStyleBackground="$backgroundSoftActive"
                disabled={isMutating}
                textColor="$text"
                label="Reset"
                backgroundColor={
                  isMutating ? "$backgroundDisabled" : "$backgroundSoft"
                }
              />
              <ActionButton
                disabled={isMutating || selectedUsers.length === 0}
                backgroundColor={
                  isMutating || selectedUsers.length === 0
                    ? "$backgroundDisabled"
                    : "$primary"
                }
                textColor={
                  isMutating || selectedUsers.length === 0
                    ? "$textDisabled"
                    : "$text"
                }
                pressStyleBackground="$primaryActive"
                onPress={onConfirmPress}
                label="Confirm"
              />
            </XStack>
          )}
        />
      </YStack>
    </ScreenContainer>
  );
};

export default NewAppointmentScreen;
