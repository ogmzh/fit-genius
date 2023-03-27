import { addHours, format } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Button, Paragraph, Stack, XStack, YStack } from "tamagui";
import ScreenContainer from "../components/screen-container";
import { useMutateAppointments } from "../queries/appointments";
import { useUsersData } from "../queries/clients";
import { ClientUser } from "../shared/types/entities";
import { HUMAN_DATE_FORMAT, SQL_DATE_FORMAT } from "../shared/utils";
import { FlatList } from "react-native";
import { ClientCard } from "../components/client-card";

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

  const [timeFor, setTimeFor] = useState<"from" | "to" | "date" | null>(
    null
  );
  const [selectedUsers, setSelectedUsers] = useState<ClientUser[]>([]);

  const { appointment: id } = useLocalSearchParams<{
    appointment: string;
  }>();

  const { data } = useUsersData();
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
    if (timeFrom && timeFrom.getHours() !== queryDateTimeFrom.getHours()) {
      setTimeTo(addHours(timeFrom, 1));
    }
  }, [timeFrom]);

  const { canGoBack, goBack } = useNavigation();

  const onTimeChange = (
    event: DateTimePickerEvent,
    value: Date | undefined
  ) => {
    setTimeFor(null); // must set this first before updating date state

    if (event.type === "set" && value) {
      switch (timeFor) {
        case "from": {
          setTimeFrom(value);
          break;
        }
        case "to": {
          if (timeFrom && value > timeFrom) {
            setTimeTo(value);
          } else {
            alert("Must be after time From");
          }
          break;
        }
        case "date": {
          setSelectedDate(value);
          break;
        }
        // No default
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
      <YStack mb="$4">
        <Paragraph
          size="$8"
          fow="bold"
          bg="$backgroundSoft"
          px="$4"
          py="$2"
          br="$2"
          mb="$2"
          alignSelf="center"
          disabled={isMutating}
          onPress={() => setTimeFor("date")}>
          {format(selectedDate, HUMAN_DATE_FORMAT)}
        </Paragraph>
        <XStack p="$2" mb="$4" alignSelf="stretch" jc="space-around">
          <YStack
            br="$4"
            bw="$1.5"
            boc="$accent"
            p="$3"
            bg="$backgroundSoft"
            disabled={isMutating}
            onPress={() => setTimeFor("from")}>
            <Paragraph size="$8">From</Paragraph>
            <Stack>
              <Paragraph size="$10">
                {timeFrom && format(timeFrom, "HH:mm")}
              </Paragraph>
            </Stack>
          </YStack>
          <YStack
            br="$4"
            bw="$1.5"
            boc="$accent"
            p="$3"
            bg="$backgroundSoft"
            disabled={isMutating}
            onPress={() => setTimeFor("to")}>
            <Paragraph size="$8">To</Paragraph>
            <Stack>
              <Paragraph size="$10">
                {timeTo && format(timeTo, "HH:mm")}
              </Paragraph>
            </Stack>
          </YStack>
        </XStack>
        <FlatList
          data={data?.clients}
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
              <Button
                w="$10"
                onPress={() => setSelectedUsers([])}
                pressStyle={{ bg: "$backgroundSoftActive" }}
                disabled={isMutating}
                color="$textSoft"
                bg={
                  isMutating ? "$backgroundDisabled" : "$backgroundSoft"
                }>
                Reset
              </Button>
              <Button
                onPress={onConfirmPress}
                w="$10"
                disabled={isMutating || selectedUsers.length === 0}
                bg={
                  isMutating || selectedUsers.length === 0
                    ? "$backgroundDisabled"
                    : "$primary"
                }
                color={
                  isMutating || selectedUsers.length === 0
                    ? "$textDisabled"
                    : "$buttonText"
                }
                pressStyle={{ bg: "$primarySoft" }}>
                Confirm
              </Button>
            </XStack>
          )}
        />
      </YStack>
      {timeFor && (
        <RNDateTimePicker
          value={pickerValue()}
          mode={timeFor === "date" ? "date" : "time"}
          is24Hour
          onChange={(event, value) => onTimeChange(event, value)}
        />
      )}
    </ScreenContainer>
    // <SafeAreaView>
    //   <View>
    //     <Pressable onPress={() => setTimeFor("date")}>
    //       <Text>{format(selectedDate, HUMAN_DATE_FORMAT)}</Text>
    //     </Pressable>
    //   </View>
    //   <View>
    //     <Pressable disabled={isLoading} onPress={() => setTimeFor("from")}>
    //       <Text>From</Text>
    //       <Text>{timeFrom && format(timeFrom, "HH:mm")}</Text>
    //     </Pressable>
    //     <Pressable disabled={isLoading} onPress={() => setTimeFor("to")}>
    //       <Text>To</Text>
    //       <Text>{timeTo && format(timeTo, "HH:mm")}</Text>
    //     </Pressable>
    //   </View>
    //   <FlatList
    //     data={data?.clients}
    //     renderItem={({ item: user }) => (
    //       <Pressable onPress={() => toggleSelectedUser(user)}>
    //         <View>
    //           <Text>{user.firstName}</Text>
    //           <Text>{user.lastName}</Text>
    //         </View>
    //         <Text>{user.email}</Text>
    //       </Pressable>
    //     )}
    //     keyExtractor={item => item.id!}
    //   />
    //   <View>
    //     {/* <PressableButton
    //       label="Clear"
    //       type="secondary"
    //       onPress={() => setSelectedUsers([])}
    //     />
    //     <PressableButton label="Create" onPress={() => onConfirmPress()} /> */}
    //   </View>

    // </SafeAreaView>
  );
};

export default NewAppointmentScreen;
