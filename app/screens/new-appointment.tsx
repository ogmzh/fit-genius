import { addHours, format } from "date-fns";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import PressableButton from "../components/pressable-button";
import { useUsersData } from "../queries/clients";
import { ClientUser } from "../shared/types/entities";
import {
  HUMAN_DATE_FORMAT,
  SQL_DATE_FORMAT,
  TIME_FORMAT,
} from "../shared/utils";
import { useLocalSearchParams } from "expo-router";
import { useMutateAppointments } from "../queries/appointments";

const now = new Date();

const NewAppointmentScreen = () => {
  const [timeFrom, setTimeFrom] = useState<Date | null>();
  const [timeTo, setTimeTo] = useState<Date | null>();

  const [timeFor, setTimeFor] = useState<"from" | "to" | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<ClientUser[]>([]);

  const { data } = useUsersData();
  const { createAppointmentAsync, isLoading } = useMutateAppointments();

  const {
    date: queryDate,
    from: queryFrom,
    to: queryTo,
  } = useLocalSearchParams<{ date: string; from: string; to: string }>();

  const queryDateTimeFrom =
    queryDate && queryFrom ? new Date(`${queryDate}T${queryFrom}`) : now; // shouldn't resolve to now as we have to pass these query params

  const queryDateTimeTo =
    queryDate && queryTo ? new Date(`${queryDate}T${queryTo}`) : now; // shouldn't resolve to now as we have to pass these query params

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
    if (timeFrom && timeFrom.getHours() !== queryDateTimeFrom.getHours()) {
      setTimeTo(addHours(timeFrom, 1));
    }
  }, [timeFrom]);

  const onTimeChange = (
    event: DateTimePickerEvent,
    value: Date | undefined
  ) => {
    setTimeFor(null); // must set this first before updating date state
    if (event.type === "set" && value) {
      if (timeFor === "from") {
        setTimeFrom(value);
      } else if (timeFor === "to") {
        if (timeFrom && value > timeFrom) {
          setTimeTo(value);
        } else {
          alert("Must be after time From");
        }
      }
    }
  };

  const pickerValue = () => {
    if (timeFor === "from" && timeFrom) {
      return timeFrom;
    } else if (timeFor === "to" && timeTo) {
      return timeTo;
    }
    return new Date();
  };

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
    if (timeFrom && timeTo) {
      await createAppointmentAsync({
        clientIds: selectedUsers.map(user => user.id!),
        day: format(timeFrom, SQL_DATE_FORMAT),
        from: format(timeFrom, TIME_FORMAT),
        to: format(timeTo, TIME_FORMAT),
      });
    }
  };

  return (
    <SafeAreaView className="flex flex-1 pt-2 pb-4 bg-slate-100 dark:bg-primary-dark">
      <View className="flex items-center mb-2">
        <Text className="font-semibold text-xl">
          {format(queryDateTimeFrom, HUMAN_DATE_FORMAT)}
        </Text>
      </View>
      <View className="flex flex-row justify-center mx-4">
        <Pressable
          disabled={isLoading}
          onPress={() => setTimeFor("from")}
          className="flex-1 justify-center rounded-md mr-2 p-4 border-2 border-primary-accentDark bg-primary-light">
          <Text>From</Text>
          <Text className="font-semibold text-2xl">
            {timeFrom && format(timeFrom, "HH:mm")}
          </Text>
        </Pressable>
        <Pressable
          disabled={isLoading}
          onPress={() => setTimeFor("to")}
          className="flex-1 justify-center rounded-md mr-2 p-4 border-2 border-primary-accentDark bg-primary-light">
          <Text>To</Text>
          <Text className="font-semibold text-2xl">
            {timeTo && format(timeTo, "HH:mm")}
          </Text>
        </Pressable>
      </View>
      <FlatList
        className="m-4"
        data={data?.clients}
        renderItem={({ item: user }) => (
          <Pressable
            onPress={() => toggleSelectedUser(user)}
            className={`flex-1 justify-start my-1 rounded-md mr-2 p-4 border-2 ${
              selectedUsers.some(
                selectedUser => selectedUser.id === user.id
              )
                ? "border-primary-accent"
                : "border-slate-50"
            } bg-primary-light`}>
            <View className="flex-row">
              <Text>{user.firstName}</Text>
              <Text className="ml-1">{user.lastName}</Text>
            </View>
            <Text>{user.email}</Text>
          </Pressable>
        )}
        keyExtractor={item => item.id!}
      />
      <View className="flex flex-row justify-around">
        <PressableButton
          label="Clear"
          type="secondary"
          onPress={() => setSelectedUsers([])}
        />
        <PressableButton label="Create" onPress={() => onConfirmPress()} />
      </View>
      {timeFor && (
        <RNDateTimePicker
          value={pickerValue()}
          mode="time"
          is24Hour
          onChange={(event, value) => onTimeChange(event, value)}
        />
      )}
    </SafeAreaView>
  );
};

export default NewAppointmentScreen;
