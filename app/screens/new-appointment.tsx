import { addHours, format } from "date-fns";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type Props = {
  selectedTimeFrom?: Date;
  selectedTimeTo?: Date;
};

const now = new Date();
const nextTimeslot =
  now.getMinutes() === 0 ? now : new Date(addHours(now, 1).setMinutes(0));

const NewAppointmentScreen = ({
  selectedTimeFrom = nextTimeslot,
  selectedTimeTo = addHours(nextTimeslot, 1),
}: Props) => {
  const [timeFrom, setTimeFrom] = useState<Date>(selectedTimeFrom);
  const [timeTo, setTimeTo] = useState<Date>(selectedTimeTo);

  const [timeFor, setTimeFor] = useState<"from" | "to" | null>(null);

  const onTimeChange = (
    event: DateTimePickerEvent,
    value: Date | undefined
  ) => {
    setTimeFor(null); // must set this first before updating date state
    if (event.type === "set" && value) {
      if (timeFor === "from") {
        setTimeFrom(value);
      } else if (timeFor === "to") {
        if (value > timeFrom) {
          setTimeTo(value);
        } else {
          alert("Must be after time From");
        }
      }
    }
  };

  const pickerValue = () => {
    if (timeFor === "from") {
      return timeFrom;
    } else if (timeFor === "to") {
      return timeTo;
    }
    return new Date();
  };

  return (
    <SafeAreaView className="flex flex-1 py-4 bg-slate-100 dark:bg-primary-dark">
      <View className="flex flex-row justify-center mx-4">
        <Pressable
          onPress={() => setTimeFor("from")}
          className="flex-1 justify-center rounded-md mr-2 p-4 border-2 border-primary-accent bg-primary-light">
          <Text>From</Text>
          <Text className="font-semibold text-2xl">
            {format(timeFrom, "HH:mm")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTimeFor("to")}
          className="flex-1 justify-center rounded-md mr-2 p-4 border-2 border-primary-accent bg-primary-light">
          <Text>To</Text>
          <Text className="font-semibold text-2xl">
            {format(timeTo, "HH:mm")}
          </Text>
        </Pressable>
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
