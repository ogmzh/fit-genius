import { addHours, format, parseISO } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import { XStack, YStack } from "tamagui";
import ScreenContainer from "../components/screen-container";
import {
  useAppointmentsData,
  useMutateAppointments,
} from "../queries/appointments";
import { useUsersData } from "../queries/clients";
import { ClientUser } from "../shared/types/entities";
import { EVENT_TIME_FORMAT, SQL_DATE_FORMAT } from "../shared/utils";
import { FlatList } from "react-native";
import { ClientCard } from "../components/client-card";
import { ActionButton } from "../components/action-button";
import { BackdropSpinner } from "../components/backdrop-spinner";
import { AppointmentPicker } from "../components/appointment-picker";
import { useIsFocused } from "@react-navigation/native";

const now = new Date();

const NewAppointmentScreen = () => {
  const {
    date: queryDate,
    from: queryFrom,
    to: queryTo,
  } = useLocalSearchParams<{ date: string; from: string; to: string }>();

  const isFocused = useIsFocused();

  const [timeFrom, setTimeFrom] = useState<Date | null>();
  const [timeTo, setTimeTo] = useState<Date | null>();
  const [selectedDate, setSelectedDate] = useState<Date>(
    queryDate ? new Date(queryDate) : now
  );

  const [selectedUsers, setSelectedUsers] = useState<ClientUser[]>([]);

  //TODO: figure out what did i want to do with this ID
  const { appointment: id } = useLocalSearchParams<{
    appointment: string;
  }>();
  const { data: todayAppointments } = useAppointmentsData(
    isFocused,
    selectedDate,
    selectedDate
  );
  const { data: clientData } = useUsersData();

  useEffect(() => {
    if (todayAppointments && timeFrom && timeTo) {
      // preselects users that have already been appointed to the selected slot
      const todayAppointment =
        todayAppointments[format(selectedDate, SQL_DATE_FORMAT)];
      if (todayAppointment) {
        const existingAppointments = todayAppointment.filter(
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
    }
  }, [todayAppointments, timeFrom, timeTo]);

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

  const { canGoBack, goBack } = useNavigation();

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
      canGoBack() && goBack();
    }
  };

  return (
    <ScreenContainer>
      <BackdropSpinner visible={isMutating} />
      <YStack mb="$4">
        <AppointmentPicker
          date={selectedDate}
          onDateChange={setSelectedDate}
          timeFrom={timeFrom}
          onTimeFromChange={setTimeFrom}
          timeTo={timeTo}
          onTimeToChange={setTimeTo}
          disabled={isMutating}
        />
        <FlatList
          data={clientData?.clients}
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
                textColor="$buttonText"
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
                    : "$buttonText"
                }
                pressStyleBackground="$primarySoft"
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
